import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscussionQuestion } from '../../models/report.model';

@Component({
    selector: 'app-questions-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="questions-section" id="questions-list">
      <div *ngFor="let q of questions; let i = index"
           class="question-card glass-card"
           [style.animation-delay]="(i * 0.1) + 's'">
        <div class="question-number">{{ i + 1 }}</div>
        <div class="question-content">
          <p class="question-text">{{ q.question }}</p>
          <p class="question-context">{{ q.context }}</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .questions-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .question-card {
      display: flex;
      gap: var(--space-md);
      padding: var(--space-lg);
      animation: fadeInUp 0.5s ease backwards;
      cursor: default;
    }

    .question-number {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .question-content {
      flex: 1;
    }

    .question-text {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: var(--space-xs);
      line-height: 1.5;
    }

    .question-context {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
      font-style: italic;
    }
  `]
})
export class QuestionsListComponent {
    @Input() questions: DiscussionQuestion[] = [];
}
