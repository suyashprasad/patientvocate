package com.patientvocate.service.ai;

import com.patientvocate.model.ChatMessage;
import com.patientvocate.model.ReportSummary;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Abstraction layer for AI model integration.
 * Implement this interface to swap between Ollama, OpenAI, Anthropic, etc.
 */
public interface AIService {

    /**
     * Analyze a medical lab report and return structured summary.
     *
     * @param reportText the raw text of the medical report
     * @return structured report summary with findings, glossary, and discussion questions
     */
    ReportSummary analyzeReport(String reportText);

    /**
     * Handle a follow-up question about a previously analyzed report.
     *
     * @param reportText         original report text for context
     * @param analysisSummary    the previous analysis summary
     * @param question           the patient's follow-up question
     * @param conversationHistory previous messages in the conversation
     * @return AI's response to the follow-up question
     */
    String answerFollowUp(String reportText, String analysisSummary,
                          String question, List<ChatMessage> conversationHistory);

    /**
     * Check if the AI service is available and responsive.
     */
    boolean isAvailable();

    /**
     * Get the name of the AI provider.
     */
    String getProviderName();

    /**
     * Check if the AI provider supports direct image analysis (multimodal).
     * Default is false (text-only).
     */
    default boolean supportsImages() {
        return false;
    }

    /**
     * Analyze a medical lab report image directly (e.g., using Gemini Vision).
     *
     * @param image the uploaded image file
     * @return structured report summary
     */
    default ReportSummary analyzeImage(MultipartFile image) {
        throw new UnsupportedOperationException("Image analysis not supported by this provider (" + getProviderName() + ")");
    }
}
