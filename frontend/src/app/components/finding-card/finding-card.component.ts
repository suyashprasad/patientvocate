import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Finding } from '../../models/report.model';

@Component({
    selector: 'app-finding-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="finding-card glass-card" [class]="'finding-' + finding.status.toLowerCase()" id="finding-card">
      <div class="finding-header">
        <h4 class="test-name">{{ finding.testName }}</h4>
        <span class="status-badge" [ngClass]="'status-' + finding.status.toLowerCase()">
          <span class="status-icon">{{ getStatusIcon() }}</span>
          {{ finding.status }}
        </span>
      </div>
      <div class="finding-values">
        <div class="value-group">
          <span class="value-label">Result</span>
          <span class="value-text">{{ finding.value }}</span>
        </div>
        <div class="value-group">
          <span class="value-label">Reference Range</span>
          <span class="value-text ref">{{ finding.referenceRange }}</span>
        </div>
      </div>
      <p class="finding-explanation">{{ finding.explanation }}</p>
    </div>
  `,
    styles: [`
    .finding-card {
      padding: var(--space-lg);
      transition: all var(--transition-base);
      border-left: 3px solid transparent;
    }

    .finding-NORMAL, .finding-normal {
      border-left-color: var(--status-normal);
    }

    .finding-BORDERLINE, .finding-borderline {
      border-left-color: var(--status-borderline);
    }

    .finding-ABNORMAL, .finding-abnormal {
      border-left-color: var(--status-abnormal);
    }

    .finding-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-md);
      gap: var(--space-sm);
    }

    .test-name {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .status-icon {
      font-size: 0.7rem;
    }

    .finding-values {
      display: flex;
      gap: var(--space-xl);
      margin-bottom: var(--space-md);
      padding: var(--space-md);
      background: var(--bg-input);
      border-radius: var(--radius-sm);
    }

    .value-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .value-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      font-weight: 600;
    }

    .value-text {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .value-text.ref {
      color: var(--text-secondary);
      font-weight: 400;
    }

    .finding-explanation {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .finding-values {
        flex-direction: column;
        gap: var(--space-sm);
      }
    }
  `]
})
export class FindingCardComponent {
    @Input() finding!: Finding;

    getStatusIcon(): string {
        switch (this.finding.status) {
            case 'NORMAL': return '✓';
            case 'BORDERLINE': return '⚠';
            case 'ABNORMAL': return '!';
            default: return '•';
        }
    }
}
