package com.patientvocate.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.patientvocate.model.ChatMessage;
import com.patientvocate.model.ReportSummary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Ollama-based AI service implementation using the Mistral model.
 * Calls Ollama REST API for report analysis and follow-up chat.
 */
@Service
public class OllamaAIService implements AIService {

    private static final Logger log = LoggerFactory.getLogger(OllamaAIService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai.ollama.model}")
    private String model;

    public OllamaAIService(@Qualifier("ollamaRestTemplate") RestTemplate restTemplate,
                           ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public ReportSummary analyzeReport(String reportText) {
        log.info("Starting report analysis with Ollama model: {}", model);

        String systemPrompt = AIPromptTemplates.REPORT_ANALYSIS_SYSTEM_PROMPT;
        String userPrompt = AIPromptTemplates.buildAnalysisUserPrompt(reportText);

        String response = callOllama(systemPrompt, userPrompt, null);

        try {
            // Clean up the response — remove any markdown code fences if present
            String cleaned = cleanJsonResponse(response);
            ReportSummary summary = objectMapper.readValue(cleaned, ReportSummary.class);
            log.info("Report analysis completed. Findings: {}, Questions: {}",
                    summary.getFindings() != null ? summary.getFindings().size() : 0,
                    summary.getDiscussionQuestions() != null ? summary.getDiscussionQuestions().size() : 0);
            return summary;
        } catch (Exception e) {
            log.error("Failed to parse AI response as ReportSummary. Raw response: {}", response, e);
            // Return a fallback summary with the raw response
            return createFallbackSummary(response);
        }
    }

    @Override
    public String answerFollowUp(String reportText, String analysisSummary,
                                  String question, List<ChatMessage> conversationHistory) {
        log.info("Processing follow-up question: {}", question);

        String systemPrompt = AIPromptTemplates.buildFollowUpSystemPrompt(reportText, analysisSummary);

        // Build messages list with conversation history
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));

        // Add conversation history
        if (conversationHistory != null) {
            for (ChatMessage msg : conversationHistory) {
                messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
            }
        }

        // Add the current question
        messages.add(Map.of("role", "user", "content", question));

        return callOllamaChat(messages);
    }

    @Override
    public boolean isAvailable() {
        try {
            restTemplate.getForObject("/api/tags", String.class);
            return true;
        } catch (Exception e) {
            log.warn("Ollama is not available: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Call Ollama /api/generate endpoint (single prompt).
     */
    private String callOllama(String systemPrompt, String userPrompt,
                              List<ChatMessage> history) {
        Map<String, Object> request = new HashMap<>();
        request.put("model", model);
        request.put("prompt", userPrompt);
        request.put("system", systemPrompt);
        request.put("stream", false);

        // Request JSON format for structured output
        request.put("format", "json");

        try {
            Map<String, Object> response = restTemplate.postForObject(
                    "/api/generate", request, Map.class);

            if (response != null && response.containsKey("response")) {
                return (String) response.get("response");
            }
            throw new RuntimeException("Empty response from Ollama");
        } catch (Exception e) {
            log.error("Ollama API call failed", e);
            throw new RuntimeException("Failed to get response from AI model: " + e.getMessage(), e);
        }
    }

    /**
     * Call Ollama /api/chat endpoint (multi-turn conversation).
     */
    private String callOllamaChat(List<Map<String, String>> messages) {
        Map<String, Object> request = new HashMap<>();
        request.put("model", model);
        request.put("messages", messages);
        request.put("stream", false);

        try {
            Map<String, Object> response = restTemplate.postForObject(
                    "/api/chat", request, Map.class);

            if (response != null && response.containsKey("message")) {
                Map<String, Object> message = (Map<String, Object>) response.get("message");
                return (String) message.get("content");
            }
            throw new RuntimeException("Empty response from Ollama chat");
        } catch (Exception e) {
            log.error("Ollama chat API call failed", e);
            throw new RuntimeException("Failed to get chat response from AI model: " + e.getMessage(), e);
        }
    }

    /**
     * Clean up JSON response — remove markdown code fences, trim whitespace.
     */
    private String cleanJsonResponse(String response) {
        if (response == null) return "{}";

        String cleaned = response.trim();

        // Remove markdown code fences (```json ... ``` or ``` ... ```)
        if (cleaned.startsWith("```")) {
            int firstNewline = cleaned.indexOf('\n');
            if (firstNewline != -1) {
                cleaned = cleaned.substring(firstNewline + 1);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
        }

        return cleaned.trim();
    }

    private ReportSummary createFallbackSummary(String rawResponse) {
        ReportSummary summary = new ReportSummary();
        summary.setSummary("The AI provided an analysis but it could not be fully structured. " +
                "Here is the raw response: " + rawResponse);
        summary.setFindings(Collections.emptyList());
        summary.setGlossary(Collections.emptyList());
        summary.setDiscussionQuestions(Collections.emptyList());
        summary.setDisclaimer("This summary is for educational purposes only. " +
                "Please discuss these results with your healthcare provider.");
        return summary;
    }

    @Override
    public String getProviderName() {
        return "ollama";
    }
}
