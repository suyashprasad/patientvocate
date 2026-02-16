package com.patientvocate.dto;

import com.patientvocate.model.ChatMessage;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * Request DTO for follow-up chat endpoint.
 */
public class ChatRequest {

    @NotBlank(message = "Report text is required for context")
    private String reportText;

    private String analysisSummary;

    @NotBlank(message = "Question cannot be empty")
    private String question;

    private List<ChatMessage> conversationHistory;

    public ChatRequest() {}

    public String getReportText() { return reportText; }
    public void setReportText(String reportText) { this.reportText = reportText; }

    public String getAnalysisSummary() { return analysisSummary; }
    public void setAnalysisSummary(String analysisSummary) { this.analysisSummary = analysisSummary; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<ChatMessage> getConversationHistory() { return conversationHistory; }
    public void setConversationHistory(List<ChatMessage> conversationHistory) { this.conversationHistory = conversationHistory; }
}
