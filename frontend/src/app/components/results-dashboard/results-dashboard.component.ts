import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportSummary } from '../../models/report.model';
import { FindingCardComponent } from '../finding-card/finding-card.component';
import { QuestionsListComponent } from '../questions-list/questions-list.component';
import { FollowUpChatComponent } from '../follow-up-chat/follow-up-chat.component';

@Component({
    selector: 'app-results-dashboard',
    standalone: true,
    imports: [CommonModule, FindingCardComponent, QuestionsListComponent, FollowUpChatComponent],
    template: `
    <div class="results-container" id="results-dashboard">

      <!-- Summary Section -->
      <section class="section summary-section animate-fade-in-up" id="summary-section">
        <div class="section-header">
          <span class="section-icon">📋</span>
          <h2>Summary</h2>
        </div>
        <div class="summary-card glass-card">
          <p class="summary-text">{{ analysis.summary }}</p>
        </div>
      </section>

      <!-- Key Findings -->
      <section class="section findings-section animate-fade-in-up stagger-1" id="findings-section">
        <div class="section-header">
          <span class="section-icon">🔬</span>
          <h2>Key Findings</h2>
          <div class="findings-stats">
            <span class="stat" *ngIf="normalCount > 0">
              <span class="stat-dot normal"></span>{{ normalCount }} Normal
            </span>
            <span class="stat" *ngIf="borderlineCount > 0">
              <span class="stat-dot borderline"></span>{{ borderlineCount }} Borderline
            </span>
            <span class="stat" *ngIf="abnormalCount > 0">
              <span class="stat-dot abnormal"></span>{{ abnormalCount }} Abnormal
            </span>
          </div>
        </div>
        <div class="findings-grid">
          <app-finding-card *ngFor="let finding of analysis.findings" [finding]="finding">
          </app-finding-card>
        </div>
      </section>

      <!-- Glossary -->
      <section *ngIf="analysis.glossary && analysis.glossary.length > 0"
               class="section glossary-section animate-fade-in-up stagger-2" id="glossary-section">
        <div class="section-header">
          <span class="section-icon">📖</span>
          <h2>Medical Terms Explained</h2>
        </div>
        <div class="glossary-grid">
          <div *ngFor="let entry of analysis.glossary" class="glossary-card glass-card">
            <dt class="glossary-term">{{ entry.term }}</dt>
            <dd class="glossary-def">{{ entry.definition }}</dd>
          </div>
        </div>
      </section>

      <!-- Discussion Questions -->
      <section *ngIf="analysis.discussionQuestions && analysis.discussionQuestions.length > 0"
               class="section questions-section animate-fade-in-up stagger-3" id="questions-section">
        <div class="section-header">
          <span class="section-icon">❓</span>
          <h2>Questions for Your Doctor</h2>
        </div>
        <app-questions-list [questions]="analysis.discussionQuestions"></app-questions-list>
      </section>

      <!-- Follow-up Chat -->
      <section class="section chat-section animate-fade-in-up stagger-4" id="chat-section">
        <div class="section-header">
          <span class="section-icon">💬</span>
          <h2>Ask Follow-up Questions</h2>
        </div>
        <app-follow-up-chat
          [reportText]="reportText"
          [analysisSummary]="analysis.summary">
        </app-follow-up-chat>
      </section>

      <!-- Disclaimer -->
      <div class="disclaimer animate-fade-in-up stagger-5" id="disclaimer">
        <span class="disclaimer-icon">⚕️</span>
        <p>{{ analysis.disclaimer }}</p>
      </div>
    </div>
  `,
    styles: [`
    .results-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xl);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
      flex-wrap: wrap;
    }

    .section-icon {
      font-size: 1.4rem;
    }

    .section-header h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .findings-stats {
      display: flex;
      gap: var(--space-md);
      margin-left: auto;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .stat-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .stat-dot.normal { background: var(--status-normal); }
    .stat-dot.borderline { background: var(--status-borderline); }
    .stat-dot.abnormal { background: var(--status-abnormal); }

    .summary-card {
      padding: var(--space-xl);
    }

    .summary-text {
      font-size: 1.05rem;
      line-height: 1.7;
      color: var(--text-secondary);
    }

    .findings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--space-md);
    }

    .glossary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-md);
    }

    .glossary-card {
      padding: var(--space-lg);
    }

    .glossary-term {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--primary-400);
      margin-bottom: var(--space-xs);
    }

    .glossary-def {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .disclaimer {
      display: flex;
      align-items: flex-start;
      gap: var(--space-md);
      padding: var(--space-lg);
      background: rgba(255, 193, 7, 0.06);
      border: 1px solid rgba(255, 193, 7, 0.15);
      border-radius: var(--radius-md);
    }

    .disclaimer-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .disclaimer p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .findings-grid {
        grid-template-columns: 1fr;
      }
      .glossary-grid {
        grid-template-columns: 1fr;
      }
      .findings-stats {
        margin-left: 0;
        width: 100%;
        margin-top: var(--space-sm);
      }
    }
  `]
})
export class ResultsDashboardComponent {
    @Input() analysis!: ReportSummary;
    @Input() reportText: string = '';

    get normalCount(): number {
        return this.analysis.findings?.filter(f => f.status === 'NORMAL').length ?? 0;
    }

    get borderlineCount(): number {
        return this.analysis.findings?.filter(f => f.status === 'BORDERLINE').length ?? 0;
    }

    get abnormalCount(): number {
        return this.analysis.findings?.filter(f => f.status === 'ABNORMAL').length ?? 0;
    }
}
