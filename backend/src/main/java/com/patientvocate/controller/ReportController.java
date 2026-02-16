package com.patientvocate.controller;

import com.patientvocate.dto.*;
import com.patientvocate.service.ReportService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * REST controller for report analysis and follow-up chat endpoints.
 */
@RestController
@RequestMapping("/api")
public class ReportController {

    private static final Logger log = LoggerFactory.getLogger(ReportController.class);

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Upload a PDF or image file for AI analysis.
     */
    @PostMapping("/reports/analyze")
    public ResponseEntity<ReportAnalysisResponse> analyzeFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "provider", defaultValue = "ollama") String provider) {
        
        log.info("Received file analysis request: {} (provider: {})", file.getOriginalFilename(), provider);
        
        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ReportAnalysisResponse.error("File is empty"));
        }

        // Delegate to service
        ReportAnalysisResponse response = reportService.analyzeFile(file, provider);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Submit raw text for AI analysis.
     */
    @PostMapping("/reports/analyze/text")
    public ResponseEntity<ReportAnalysisResponse> analyzeText(
            @Valid @RequestBody TextAnalysisRequest request,
            @RequestParam(value = "provider", defaultValue = "ollama") String provider) {
        
        log.info("Received text analysis request (provider: {})", provider);
        
        ReportAnalysisResponse response = reportService.analyzeText(request.getReportText(), provider);
        
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Follow-up chat endpoint for patient questions.
     */
    @PostMapping("/reports/chat")
    public ResponseEntity<ChatResponse> chat(
            @Valid @RequestBody ChatRequest request,
            @RequestParam(value = "provider", defaultValue = "ollama") String provider) {
        
        log.info("Received chat request (provider: {})", provider);
        
        try {
            String answer = reportService.handleFollowUp(
                    request.getReportText(),
                    request.getAnalysisSummary(),
                    request.getQuestion(),
                    request.getConversationHistory(),
                    provider
            );
            
            return ResponseEntity.ok(ChatResponse.success(answer));
        } catch (Exception e) {
            log.error("Follow-up chat failed", e);
            return ResponseEntity.internalServerError()
                    .body(ChatResponse.error("Failed to process your question: " + e.getMessage()));
        }
    }

    /**
     * Health check endpoint — verifies server and AI model status.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        boolean aiAvailable = reportService.isAIAvailable();

        Map<String, Object> status = Map.of(
                "status", "UP",
                "aiModel", Map.of(
                        "available", aiAvailable,
                        "provider", "ollama",
                        "model", "mistral"
                )
        );

        return ResponseEntity.ok(status);
    }
}
