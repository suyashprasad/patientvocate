import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../models/report.model';
import { ReportService } from '../../services/report.service';

@Component({
    selector: 'app-follow-up-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="chat-container glass-card" id="follow-up-chat">
      <div class="chat-header">
        <span class="chat-icon">💬</span>
        <h3>Ask Follow-up Questions</h3>
        <p class="chat-subtitle">Ask anything about your report — I'll help you understand.</p>
      </div>

      <div class="chat-messages" #messagesContainer id="chat-messages">
        <div *ngIf="messages.length === 0" class="chat-empty">
          <p>Try asking something like:</p>
          <div class="suggestion-chips">
            <button *ngFor="let s of suggestions" class="suggestion-chip"
                    (click)="askQuestion(s)">{{ s }}</button>
          </div>
        </div>

        <div *ngFor="let msg of messages" class="chat-message"
             [class.user]="msg.role === 'user'"
             [class.assistant]="msg.role === 'assistant'">
          <div class="message-avatar">{{ msg.role === 'user' ? '👤' : '🩺' }}</div>
          <div class="message-bubble">
            <p>{{ msg.content }}</p>
          </div>
        </div>

        <div *ngIf="isLoading" class="chat-message assistant">
          <div class="message-avatar">🩺</div>
          <div class="message-bubble typing">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <input
          [(ngModel)]="currentQuestion"
          (keydown.enter)="sendQuestion()"
          placeholder="Type your question..."
          class="chat-input"
          [disabled]="isLoading"
          id="chat-input"
        />
        <button class="btn btn-primary send-btn"
                [disabled]="!currentQuestion.trim() || isLoading"
                (click)="sendQuestion()"
                id="chat-send-btn">
          ➤
        </button>
      </div>
    </div>
  `,
    styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 500px;
      overflow: hidden;
    }

    .chat-header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .chat-header h3 {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 1.1rem;
      font-weight: 600;
    }

    .chat-icon {
      font-size: 1.2rem;
    }

    .chat-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .chat-empty {
      text-align: center;
      padding: var(--space-xl) 0;
      color: var(--text-muted);
    }

    .chat-empty p {
      margin-bottom: var(--space-md);
      font-size: 0.9rem;
    }

    .suggestion-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      justify-content: center;
    }

    .suggestion-chip {
      padding: 8px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-family: var(--font-sans);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .suggestion-chip:hover {
      border-color: var(--primary-400);
      color: var(--primary-400);
      background: var(--bg-card-hover);
    }

    .chat-message {
      display: flex;
      gap: var(--space-sm);
      animation: fadeInUp 0.3s ease;
    }

    .chat-message.user {
      flex-direction: row-reverse;
    }

    .message-avatar {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .message-bubble {
      max-width: 75%;
      padding: var(--space-md);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .user .message-bubble {
      background: linear-gradient(135deg, var(--primary-600), var(--primary-800));
      color: white;
      border-bottom-right-radius: 4px;
    }

    .assistant .message-bubble {
      background: var(--bg-card);
      color: var(--text-primary);
      border: 1px solid var(--border-subtle);
      border-bottom-left-radius: 4px;
    }

    .message-bubble.typing {
      display: flex;
      gap: 6px;
      align-items: center;
      padding: var(--space-md) var(--space-lg);
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      background: var(--text-muted);
      border-radius: 50%;
      animation: typingBounce 1.4s infinite ease-in-out;
    }

    .typing-dot:nth-child(1) { animation-delay: 0s; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingBounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    .chat-input-area {
      display: flex;
      gap: var(--space-sm);
      padding: var(--space-md) var(--space-lg);
      border-top: 1px solid var(--border-subtle);
    }

    .chat-input {
      flex: 1;
      background: var(--bg-input);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-md);
      padding: var(--space-md);
      font-family: var(--font-sans);
      font-size: 0.9rem;
      color: var(--text-primary);
      transition: border-color var(--transition-fast);
    }

    .chat-input::placeholder {
      color: var(--text-muted);
    }

    .chat-input:focus {
      outline: none;
      border-color: var(--primary-500);
    }

    .chat-input:disabled {
      opacity: 0.6;
    }

    .send-btn {
      padding: var(--space-md) var(--space-lg);
      font-size: 1.1rem;
      min-width: 50px;
    }
  `]
})
export class FollowUpChatComponent {
    @Input() reportText: string = '';
    @Input() analysisSummary: string = '';

    messages: ChatMessage[] = [];
    currentQuestion = '';
    isLoading = false;

    suggestions = [
        'What does this mean for my health?',
        'Should I be worried about any results?',
        'What lifestyle changes might help?',
        'What should I ask my doctor about?'
    ];

    constructor(private reportService: ReportService) { }

    askQuestion(question: string) {
        this.currentQuestion = question;
        this.sendQuestion();
    }

    sendQuestion() {
        const question = this.currentQuestion.trim();
        if (!question || this.isLoading) return;

        // Add user message
        this.messages.push({ role: 'user', content: question });
        this.currentQuestion = '';
        this.isLoading = true;

        this.reportService.chat({
            reportText: this.reportText,
            analysisSummary: this.analysisSummary,
            question: question,
            conversationHistory: this.messages.slice(0, -1) // exclude current
        }).subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.messages.push({ role: 'assistant', content: response.answer });
                } else {
                    this.messages.push({
                        role: 'assistant',
                        content: 'Sorry, I encountered an error. Please try again.'
                    });
                }
            },
            error: () => {
                this.isLoading = false;
                this.messages.push({
                    role: 'assistant',
                    content: 'Sorry, I couldn\'t connect to the AI service. Please make sure the backend is running.'
                });
            }
        });
    }
}
