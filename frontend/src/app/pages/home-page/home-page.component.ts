import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UploadZoneComponent } from '../../components/upload-zone/upload-zone.component';
import { LoadingAnimationComponent } from '../../components/loading-animation/loading-animation.component';
import { ResultsDashboardComponent } from '../../components/results-dashboard/results-dashboard.component';
import { ReportService } from '../../services/report.service';
import { ReportSummary } from '../../models/report.model';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [CommonModule, UploadZoneComponent, LoadingAnimationComponent, ResultsDashboardComponent],
    template: `
    <div class="home-page container">
      <!-- Hero Section -->
      <section *ngIf="!isLoading && !analysisResult" class="hero animate-fade-in-up" id="hero-section">
        <div class="hero-badge">🩺 AI-Powered</div>
        <h1 class="hero-title">
          Understand Your Lab Reports
          <span class="hero-gradient">Before Your Doctor Visit</span>
        </h1>
        <p class="hero-subtitle">
          Upload your medical lab report and get a clear, plain-language summary
          with personalized questions to ask your healthcare provider.
        </p>
        <div class="hero-features">
          <div class="feature">
            <span class="feature-icon">📊</span>
            <span>Plain-language summaries</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🔍</span>
            <span>Key findings highlighted</span>
          </div>
          <div class="feature">
            <span class="feature-icon">❓</span>
            <span>Doctor discussion questions</span>
          </div>
          <div class="feature">
            <span class="feature-icon">💬</span>
            <span>Follow-up Q&A</span>
          </div>
        </div>
      </section>

      <!-- Upload Zone -->
      <section *ngIf="!isLoading && !analysisResult" class="upload-wrapper" id="upload-section">
        <app-upload-zone
          (analyzeFile)="onAnalyzeFile($event)"
          (analyzeText)="onAnalyzeText($event)">
        </app-upload-zone>
      </section>

      <!-- Loading Animation -->
      <app-loading-animation *ngIf="isLoading"></app-loading-animation>

      <!-- Results -->
      <section *ngIf="analysisResult && !isLoading" class="results-wrapper" id="results-wrapper">
        <div class="results-header animate-fade-in-up">
          <h2>Your Report Analysis</h2>
          <button class="btn btn-secondary" (click)="resetAnalysis()" id="new-report-btn">
            📄 Analyze New Report
          </button>
        </div>
        <app-results-dashboard
          [analysis]="analysisResult"
          [reportText]="currentReportText">
        </app-results-dashboard>
      </section>

      <!-- Error -->
      <div *ngIf="error && !isLoading" class="error-card glass-card animate-fade-in-up" id="error-message">
        <span class="error-icon">⚠️</span>
        <div class="error-content">
          <h3>Something went wrong</h3>
          <p>{{ error }}</p>
          <button class="btn btn-secondary" (click)="error = null">Try Again</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .home-page {
      padding-top: var(--space-2xl);
      padding-bottom: var(--space-3xl);
    }

    /* Hero */
    .hero {
      text-align: center;
      margin-bottom: var(--space-2xl);
    }

    .hero-badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(0, 188, 212, 0.1);
      border: 1px solid rgba(0, 188, 212, 0.2);
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--primary-400);
      margin-bottom: var(--space-lg);
    }

    .hero-title {
      font-size: 2.8rem;
      font-weight: 800;
      line-height: 1.2;
      color: var(--text-primary);
      margin-bottom: var(--space-lg);
      letter-spacing: -0.03em;
    }

    .hero-gradient {
      display: block;
      background: linear-gradient(135deg, var(--primary-300), var(--primary-500), #7c4dff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto var(--space-xl);
      line-height: 1.7;
    }

    .hero-features {
      display: flex;
      justify-content: center;
      gap: var(--space-xl);
      flex-wrap: wrap;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .feature-icon {
      font-size: 1.2rem;
    }

    /* Upload wrapper */
    .upload-wrapper {
      max-width: 700px;
      margin: 0 auto;
    }

    /* Results */
    .results-wrapper {
      animation: fadeInUp 0.5s ease;
    }

    .results-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-xl);
      flex-wrap: wrap;
      gap: var(--space-md);
    }

    .results-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
    }

    /* Error */
    .error-card {
      display: flex;
      align-items: flex-start;
      gap: var(--space-lg);
      padding: var(--space-xl);
      max-width: 600px;
      margin: var(--space-2xl) auto;
      border-color: rgba(239, 83, 80, 0.3);
    }

    .error-icon {
      font-size: 2rem;
    }

    .error-content h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: var(--space-xs);
      color: var(--status-abnormal);
    }

    .error-content p {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-md);
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      .hero-features {
        flex-direction: column;
        align-items: center;
        gap: var(--space-md);
      }
    }
  `]
})
export class HomePageComponent {
    isLoading = false;
    analysisResult: ReportSummary | null = null;
    currentReportText = '';
    error: string | null = null;

    constructor(private reportService: ReportService) { }

    onAnalyzeFile(file: File) {
        this.isLoading = true;
        this.error = null;

        this.reportService.analyzeFile(file).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.analysisResult = response.analysis;
                    this.currentReportText = response.reportText;
                } else {
                    this.error = response.error || 'Analysis failed. Please try again.';
                }
            },
            error: (err) => {
                this.isLoading = false;
                this.error = 'Could not connect to the server. Make sure the backend is running on port 8080.';
            }
        });
    }

    onAnalyzeText(text: string) {
        this.isLoading = true;
        this.error = null;
        this.currentReportText = text;

        this.reportService.analyzeText(text).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.analysisResult = response.analysis;
                    this.currentReportText = response.reportText;
                } else {
                    this.error = response.error || 'Analysis failed. Please try again.';
                }
            },
            error: (err) => {
                this.isLoading = false;
                this.error = 'Could not connect to the server. Make sure the backend is running on port 8080.';
            }
        });
    }

    resetAnalysis() {
        this.analysisResult = null;
        this.currentReportText = '';
        this.error = null;
    }
}
