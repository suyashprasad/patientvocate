import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    ReportAnalysisResponse,
    ChatRequest,
    ChatResponse,
    HealthStatus
} from '../models/report.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private readonly apiUrl = 'http://localhost:8080/api';
    currentProvider = 'ollama'; // Default provider

    constructor(private http: HttpClient) { }

    setProvider(provider: string) {
        this.currentProvider = provider;
    }

    /**
     * Upload a PDF or image file for analysis.
     */
    analyzeFile(file: File): Observable<ReportAnalysisResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ReportAnalysisResponse>(
            `${this.apiUrl}/reports/analyze?provider=${this.currentProvider}`, formData
        );
    }

    /**
     * Submit raw text for analysis.
     */
    analyzeText(text: string): Observable<ReportAnalysisResponse> {
        return this.http.post<ReportAnalysisResponse>(
            `${this.apiUrl}/reports/analyze/text?provider=${this.currentProvider}`, { reportText: text }
        );
    }

    /**
     * Send a follow-up question.
     */
    chat(request: ChatRequest): Observable<ChatResponse> {
        return this.http.post<ChatResponse>(
            `${this.apiUrl}/reports/chat?provider=${this.currentProvider}`, request
        );
    }

    /**
     * Check API health status.
     */
    getHealth(): Observable<HealthStatus> {
        return this.http.get<HealthStatus>(`${this.apiUrl}/health`);
    }
}
