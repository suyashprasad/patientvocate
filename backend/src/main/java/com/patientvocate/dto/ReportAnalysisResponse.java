package com.patientvocate.dto;

import com.patientvocate.model.ReportSummary;

/**
 * Response DTO for report analysis endpoint.
 */
public class ReportAnalysisResponse {

    private boolean success;
    private ReportSummary analysis;
    private String reportText;
    private String error;

    public ReportAnalysisResponse() {}

    public static ReportAnalysisResponse success(ReportSummary analysis, String reportText) {
        ReportAnalysisResponse response = new ReportAnalysisResponse();
        response.setSuccess(true);
        response.setAnalysis(analysis);
        response.setReportText(reportText);
        return response;
    }

    public static ReportAnalysisResponse error(String error) {
        ReportAnalysisResponse response = new ReportAnalysisResponse();
        response.setSuccess(false);
        response.setError(error);
        return response;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public ReportSummary getAnalysis() { return analysis; }
    public void setAnalysis(ReportSummary analysis) { this.analysis = analysis; }

    public String getReportText() { return reportText; }
    public void setReportText(String reportText) { this.reportText = reportText; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
