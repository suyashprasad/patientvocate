import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-animation',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="loading-container" id="loading-animation">
      <div class="loading-visual">
        <div class="pulse-ring"></div>
        <div class="pulse-ring delay-1"></div>
        <div class="pulse-ring delay-2"></div>
        <div class="loading-icon">🔬</div>
      </div>
      <h3 class="loading-title">Analyzing Your Report</h3>
      <p class="loading-message">{{ messages[currentMessage] }}</p>
      <div class="loading-bar">
        <div class="loading-bar-fill"></div>
      </div>
    </div>
  `,
    styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3xl) var(--space-lg);
      text-align: center;
      animation: fadeIn 0.4s ease;
    }

    .loading-visual {
      position: relative;
      width: 120px;
      height: 120px;
      margin-bottom: var(--space-xl);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pulse-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid var(--primary-400);
      opacity: 0;
      animation: pulseRing 2.5s ease-out infinite;
    }

    .delay-1 { animation-delay: 0.5s; }
    .delay-2 { animation-delay: 1s; }

    @keyframes pulseRing {
      0% {
        transform: scale(0.5);
        opacity: 0.8;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    .loading-icon {
      font-size: 3rem;
      animation: float 3s ease-in-out infinite;
    }

    .loading-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-sm);
    }

    .loading-message {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-xl);
      max-width: 400px;
      min-height: 3em;
      transition: opacity 0.3s ease;
    }

    .loading-bar {
      width: 300px;
      height: 4px;
      background: var(--bg-card);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .loading-bar-fill {
      height: 100%;
      border-radius: var(--radius-full);
      background: linear-gradient(90deg, var(--primary-500), var(--primary-300), var(--primary-500));
      background-size: 200% 100%;
      animation: shimmer 1.5s linear infinite;
      width: 60%;
    }
  `]
})
export class LoadingAnimationComponent {
    messages = [
        'Reading your lab report carefully...',
        'Identifying key findings and values...',
        'Translating medical terminology...',
        'Comparing with reference ranges...',
        'Generating discussion questions for your doctor...',
        'Almost done — preparing your summary...'
    ];

    currentMessage = 0;

    constructor() {
        setInterval(() => {
            this.currentMessage = (this.currentMessage + 1) % this.messages.length;
        }, 3500);
    }
}
