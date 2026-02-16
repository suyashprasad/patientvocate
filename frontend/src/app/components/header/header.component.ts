import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <div class="header-inner container">
        <a routerLink="/" class="logo" id="header-logo">
          <span class="logo-icon">🩺</span>
          <span class="logo-text">Patient<span class="logo-accent">Vocate</span></span>
        </a>
        <div class="header-right">
          <div class="provider-switch" id="ai-provider-switch">
             <button class="switch-btn" [class.active]="provider === 'ollama'" (click)="setProvider('ollama')" title="Run locally with Ollama (Privacy focused)">
               🏠 Local
             </button>
             <button class="switch-btn" [class.active]="provider === 'openrouter'" (click)="setProvider('openrouter')" title="Run on Cloud with OpenRouter (DeepSeek)">
               ☁️ OpenRouter
             </button>
          </div>
          <div class="ai-status" [class.online]="aiOnline" [class.offline]="!aiOnline" id="ai-status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">{{ aiOnline ? 'AI Online' : 'AI Offline' }}</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(10, 14, 39, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
      height: 80px;
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text-primary);
    }

    .logo-icon {
      font-size: 1.8rem;
    }

    .logo-text {
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .logo-accent {
      color: var(--primary-400);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .provider-switch {
      display: flex;
      background: var(--bg-secondary);
      padding: 3px;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-medium);
    }

    .switch-btn {
      padding: 6px 12px;
      border-radius: var(--radius-full);
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .switch-btn:hover {
      color: var(--text-primary);
    }

    .switch-btn.active {
      background: var(--bg-card);
      color: var(--primary-400);
      box-shadow: var(--shadow-sm);
      font-weight: 600;
    }

    .ai-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 500;
      transition: all var(--transition-base);
    }

    .ai-status.online {
      background: var(--status-normal-bg);
      border: 1px solid rgba(102, 187, 106, 0.3);
      color: var(--status-normal);
    }

    .ai-status.offline {
      background: var(--status-abnormal-bg);
      border: 1px solid rgba(239, 83, 80, 0.3);
      color: var(--status-abnormal);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .online .status-dot {
      background: var(--status-normal);
    }

    .offline .status-dot {
      background: var(--status-abnormal);
      animation: none;
    }
  `]
})
export class HeaderComponent implements OnInit {
  aiOnline = false;
  provider = 'ollama';

  constructor(private reportService: ReportService) { }

  ngOnInit() {
    this.checkHealth();
  }

  setProvider(p: string) {
    this.provider = p;
    this.reportService.setProvider(p);
  }

  checkHealth() {
    this.reportService.getHealth().subscribe({
      next: (health) => {
        this.aiOnline = health.aiModel?.available ?? false;
      },
      error: () => {
        this.aiOnline = false;
      }
    });
  }
}
