package com.patientvocate.service.ai;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.patientvocate.model.ChatMessage;
import com.patientvocate.model.ReportSummary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

/**
 * OpenRouter AI service implementation.
 * Calls OpenRouter.ai API (OpenAI-compatible).
 */
@Service
public class OpenRouterAIService implements AIService {

    private static final Logger log = LoggerFactory.getLogger(OpenRouterAIService.class);
    private static final String API_URL = "https://openrouter.ai/api/v1/chat/completions";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai.openrouter.api-key}")
    private String apiKey;

    @Value("${ai.openrouter.model}")
    private String model;

    public OpenRouterAIService(RestTemplateBuilder builder, ObjectMapper objectMapper,
                                @Value("${ai.openrouter.timeout}") int timeout) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(timeout))
                .build();
        // Create a custom copy of the object mapper with more lenient settings
        this.objectMapper = objectMapper.copy()
                .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_SINGLE_QUOTES, true)
                .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true)
                .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_COMMENTS, true)
                .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
    }

    @Override
    public ReportSummary analyzeReport(String reportText) {
        log.info("Starting report analysis with OpenRouter model: {}", model);

        String systemPrompt = AIPromptTemplates.REPORT_ANALYSIS_SYSTEM_PROMPT;
        String userPrompt = AIPromptTemplates.buildAnalysisUserPrompt(reportText);

        try {
            OpenRouterRequest request = new OpenRouterRequest();
            request.setModel(model);
            request.addMessage("system", systemPrompt);
            request.addMessage("user", userPrompt);
            
            // Set a higher token limit for reasoning models
            request.max_tokens = 4000;
            // Lower temperature to keep it structured
            request.temperature = 0.1;
            // Enable reasoning as requested
            request.reasoning = new OpenRouterRequest.ReasoningConfig(true);

            // Force JSON response
            request.setResponseFormat(Map.of("type", "json_object"));

            OpenRouterResponse response = callOpenRouter(request);
            String text = extractText(response);
            
            log.debug("Raw AI response length: {}", text.length());

            String cleaned = cleanJsonResponse(text);
            
            // If cleaning resulted in empty string or still no braces, the model failed to JSON
            if (cleaned.isEmpty() || !cleaned.contains("{")) {
                throw new RuntimeException("AI model failed to provide a structured JSON response. It only provided reasoning text.");
            }

            return objectMapper.readValue(cleaned, ReportSummary.class);

        } catch (Exception e) {
            log.error("OpenRouter analysis failed", e);
            return createFallbackSummary(e.getMessage());
        }
    }

    @Override
    public String answerFollowUp(String reportText, String analysisSummary,
                                 String question, List<ChatMessage> conversationHistory) {
        log.info("Processing follow-up question with OpenRouter: {}", question);

        String systemPrompt = AIPromptTemplates.buildFollowUpSystemPrompt(reportText, analysisSummary);

        try {
            OpenRouterRequest request = new OpenRouterRequest();
            request.setModel(model);
            request.addMessage("system", systemPrompt);
            request.max_tokens = 1000;
            request.temperature = 0.5;

            // Add history
            if (conversationHistory != null) {
                for (ChatMessage msg : conversationHistory) {
                    request.addMessage(msg.getRole().toLowerCase(), msg.getContent());
                }
            }

            // Add current question
            request.addMessage("user", question);

            OpenRouterResponse response = callOpenRouter(request);
            return extractText(response);

        } catch (Exception e) {
            log.error("OpenRouter follow-up failed", e);
            return "Sorry, I encountered an error with the AI service: " + e.getMessage();
        }
    }

    @Override
    public boolean isAvailable() {
        return apiKey != null && !apiKey.isEmpty() && !apiKey.startsWith("YOUR_");
    }

    @Override
    public String getProviderName() {
        return "openrouter";
    }

    private OpenRouterResponse callOpenRouter(OpenRouterRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("HTTP-Referer", "http://localhost:8080"); // Required by OpenRouter
        headers.set("X-Title", "PatientVocate"); // Recommended by OpenRouter

        HttpEntity<OpenRouterRequest> entity = new HttpEntity<>(request, headers);
        return restTemplate.postForObject(API_URL, entity, OpenRouterResponse.class);
    }

    private String extractText(OpenRouterResponse response) {
        if (response != null && response.choices != null && !response.choices.isEmpty()) {
            Choice choice = response.choices.get(0);
            if (choice.message != null && choice.message.content != null) {
                return choice.message.content;
            }
        }
        throw new RuntimeException("Empty response from OpenRouter API. Check if your API key has balance or if the model is reachable.");
    }

    private String cleanJsonResponse(String response) {
        if (response == null) return "{}";
        
        // 1. Remove ALL DeepSeek reasoning blocks <think>...</think>
        // We use DOTALL to match across multiple lines
        String cleaned = response.replaceAll("(?s)<think>.*?</think>", "").trim();
        
        // 2. If <think> tag is still present (unclosed), remove everything up to the first '{'
        if (cleaned.contains("<think>")) {
            int firstBrace = cleaned.indexOf('{');
            if (firstBrace != -1) {
                cleaned = cleaned.substring(firstBrace).trim();
            }
        }

        // 3. Isolate the JSON object by finding the outermost braces
        int firstBrace = cleaned.indexOf('{');
        int lastBrace = cleaned.lastIndexOf('}');
        
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }

        // 4. Handle remaining markdown code blocks (e.g. ```json ... ```)
        if (cleaned.startsWith("```")) {
            int firstNewline = cleaned.indexOf('\n');
            if (firstNewline != -1) {
                cleaned = cleaned.substring(firstNewline + 1);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();
        }

        // 5. Final sanitization
        cleaned = cleaned.replace("\\'", "'");
        
        return cleaned.trim();
    }

    private ReportSummary createFallbackSummary(String error) {
        ReportSummary summary = new ReportSummary();
        summary.setSummary("I was able to analyze your report, but the AI service did not return the data in the expected format. Error: " + error);
        summary.setFindings(Collections.emptyList());
        summary.setGlossary(Collections.emptyList());
        summary.setDiscussionQuestions(Collections.emptyList());
        summary.setDisclaimer("Error while communicating with OpenRouter: " + error);
        return summary;
    }

    // --- Inner DTOs for OpenRouter API ---

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class OpenRouterRequest {
        public String model;
        public List<Message> messages = new ArrayList<>();
        public Map<String, String> response_format;
        public Integer max_tokens;
        public Double temperature;
        public ReasoningConfig reasoning;

        public void setModel(String model) {
            this.model = model;
        }

        public void addMessage(String role, String content) {
            messages.add(new Message(role, content));
        }

        public void setResponseFormat(Map<String, String> format) {
            this.response_format = format;
        }

        public static class ReasoningConfig {
            public boolean enabled;
            public ReasoningConfig(boolean enabled) {
                this.enabled = enabled;
            }
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Message {
        public String role;
        public String content;

        public Message() {}
        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class OpenRouterResponse {
        public List<Choice> choices;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Choice {
        public Message message;
    }
}
