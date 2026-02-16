package com.patientvocate.service;

import com.patientvocate.dto.ReportAnalysisResponse;
import com.patientvocate.model.ChatMessage;
import com.patientvocate.model.ReportSummary;
import com.patientvocate.service.ai.AIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Orchestrates the report analysis workflow:
 * file upload → text extraction → AI analysis → response.
 */
@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);

    private final Map<String, AIService> aiServices;
    private final PDFParserService pdfParserService;
    private final OCRService ocrService;

    public ReportService(List<AIService> services, PDFParserService pdfParserService, OCRService ocrService) {
        this.aiServices = new HashMap<>(); // Standard Map implementation
        for (AIService service : services) {
            this.aiServices.put(service.getProviderName(), service);
        }
        this.pdfParserService = pdfParserService;
        this.ocrService = ocrService;
    }

    /**
     * Analyze a report from an uploaded file (PDF or image).
     */
    public ReportAnalysisResponse analyzeFile(MultipartFile file, String provider) {
        try {
            // Check for direct image analysis support (e.g., Gemini Vision)
            if (ocrService.isImage(file)) {
                try {
                    AIService service = getService(provider);
                    if (service.supportsImages()) {
                        log.info("Using AI provider for direct image analysis: {}", service.getProviderName());
                        ReportSummary summary = service.analyzeImage(file);
                        return ReportAnalysisResponse.success(summary, "[Direct Image Analysis by " + provider + "]");
                    }
                } catch (IllegalArgumentException e) {
                    log.warn("Provider lookup failed for image check: {}", e.getMessage());
                } catch (Exception e) {
                    log.error("Direct image analysis failed, falling back to OCR: {}", e.getMessage());
                    // Fallback continues below
                }
            }

            String reportText = extractTextFromFile(file);
            return analyzeText(reportText, provider);
        } catch (Exception e) {
            log.error("Failed to analyze file: {}", file.getOriginalFilename(), e);
            return ReportAnalysisResponse.error("Failed to process file: " + e.getMessage());
        }
    }

    /**
     * Analyze a report from raw text input.
     */
    public ReportAnalysisResponse analyzeText(String reportText, String provider) {
        try {
            if (reportText == null || reportText.trim().isEmpty()) {
                return ReportAnalysisResponse.error("Report text is empty. Please provide lab report content.");
            }

            log.info("Analyzing report text ({} characters) using provider: {}", reportText.length(), provider);
            
            AIService service = getService(provider);
            ReportSummary summary = service.analyzeReport(reportText);
            
            return ReportAnalysisResponse.success(summary, reportText);

        } catch (Exception e) {
            log.error("Failed to analyze report text", e);
            return ReportAnalysisResponse.error("Analysis failed: " + e.getMessage());
        }
    }

    /**
     * Handle a follow-up chat question.
     */
    public String handleFollowUp(String reportText, String analysisSummary,
                                  String question, List<ChatMessage> conversationHistory, String provider) {
        AIService service = getService(provider);
        return service.answerFollowUp(reportText, analysisSummary, question, conversationHistory);
    } 

    private AIService getService(String provider) {
        if (provider == null || provider.isEmpty()) {
            return aiServices.get("openrouter"); // Default
        }
        String providerKey = provider.toLowerCase();
        if ("gemini".equals(providerKey)) {
            providerKey = "openrouter";
        }
        AIService service = aiServices.get(providerKey);
        if (service == null) {
            throw new IllegalArgumentException("Unsupported AI provider: " + provider);
        }
        return service;
    }

    /**
     * Check AI service availability.
     */
    public boolean isAIAvailable() {
        return aiServices.values().stream().anyMatch(AIService::isAvailable);
    }

    /**
     * Extract text from an uploaded file based on its type.
     */
    private String extractTextFromFile(MultipartFile file) {
        if (pdfParserService.isPDF(file)) {
            log.info("Processing as PDF: {}", file.getOriginalFilename());
            return pdfParserService.extractText(file);
        } else if (ocrService.isImage(file)) {
            log.info("Processing as image (OCR): {}", file.getOriginalFilename());
            return ocrService.extractText(file);
        } else {
            throw new RuntimeException(
                    "Unsupported file type. Please upload a PDF or image (JPG, PNG, TIFF, BMP).");
        }
    }
}
