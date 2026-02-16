package com.patientvocate.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for text-based report analysis.
 */
public class TextAnalysisRequest {

    @NotBlank(message = "Report text cannot be empty")
    private String reportText;

    public TextAnalysisRequest() {}

    public TextAnalysisRequest(String reportText) {
        this.reportText = reportText;
    }

    public String getReportText() { return reportText; }
    public void setReportText(String reportText) { this.reportText = reportText; }
}
