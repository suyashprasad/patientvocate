import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-upload-zone',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="upload-section">
      <!-- Tab switcher -->
      <div class="tab-switcher" id="upload-tab-switcher">
        <button class="tab" [class.active]="activeTab === 'file'" (click)="activeTab = 'file'" id="tab-file">
          📄 Upload File
        </button>
        <button class="tab" [class.active]="activeTab === 'text'" (click)="activeTab = 'text'" id="tab-text">
          ⌨️ Paste Text
        </button>
      </div>

      <!-- File upload zone -->
      <div *ngIf="activeTab === 'file'"
           class="drop-zone glass-card"
           [class.drag-over]="isDragging"
           [class.has-file]="selectedFile !== null"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           (click)="fileInput.click()"
           id="file-drop-zone">

        <input #fileInput type="file" accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp"
               (change)="onFileSelected($event)" hidden id="file-input">

        <div *ngIf="!selectedFile" class="drop-content">
          <div class="drop-icon">📤</div>
          <h3>Drop your lab report here</h3>
          <p>or click to browse</p>
          <span class="supported-formats">PDF, JPG, PNG, TIFF, BMP</span>
        </div>

        <div *ngIf="selectedFile" class="file-preview">
          <div class="file-icon">{{ getFileIcon() }}</div>
          <div class="file-info">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
          <button class="btn-remove" (click)="removeFile($event)" id="remove-file-btn">✕</button>
        </div>
      </div>

      <!-- Text input zone -->
      <div *ngIf="activeTab === 'text'" class="text-zone glass-card">
        <textarea
          [(ngModel)]="reportText"
          placeholder="Paste your lab report text here...&#10;&#10;Example:&#10;Complete Blood Count (CBC)&#10;WBC: 7.2 x10^3/uL (Ref: 4.5-11.0)&#10;RBC: 4.8 x10^6/uL (Ref: 4.0-5.5)&#10;Hemoglobin: 14.2 g/dL (Ref: 12.0-16.0)&#10;..."
          class="text-input"
          rows="12"
          id="report-text-input"
        ></textarea>
      </div>

      <!-- Analyze button -->
      <button class="btn btn-primary analyze-btn"
              [disabled]="!canAnalyze()"
              (click)="onAnalyze()"
              id="analyze-btn">
        <span class="btn-icon-text">🔬</span>
        Analyze Report
      </button>
    </div>
  `,
    styles: [`
    .upload-section {
      animation: fadeInUp 0.6s ease;
    }

    .tab-switcher {
      display: flex;
      gap: var(--space-xs);
      margin-bottom: var(--space-lg);
      background: var(--bg-secondary);
      padding: 4px;
      border-radius: var(--radius-md);
      width: fit-content;
    }

    .tab {
      padding: 10px 24px;
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .tab.active {
      color: var(--text-primary);
      background: var(--bg-card);
      box-shadow: var(--shadow-sm);
    }

    .tab:hover:not(.active) {
      color: var(--text-primary);
    }

    .drop-zone {
      padding: var(--space-3xl) var(--space-xl);
      text-align: center;
      cursor: pointer;
      border: 2px dashed var(--border-medium);
      transition: all var(--transition-base);
      position: relative;
      overflow: hidden;
    }

    .drop-zone::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(0, 188, 212, 0.03), transparent);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .drop-zone:hover::before,
    .drop-zone.drag-over::before {
      opacity: 1;
    }

    .drop-zone:hover,
    .drop-zone.drag-over {
      border-color: var(--primary-400);
      box-shadow: var(--shadow-glow);
    }

    .drop-zone.has-file {
      border-style: solid;
      border-color: var(--primary-500);
      padding: var(--space-xl);
    }

    .drop-content {
      position: relative;
      z-index: 1;
    }

    .drop-icon {
      font-size: 3rem;
      margin-bottom: var(--space-md);
      animation: float 4s ease-in-out infinite;
    }

    .drop-content h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-xs);
    }

    .drop-content p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: var(--space-md);
    }

    .supported-formats {
      display: inline-block;
      font-size: 0.75rem;
      color: var(--text-muted);
      background: var(--bg-secondary);
      padding: 4px 12px;
      border-radius: var(--radius-full);
    }

    .file-preview {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      position: relative;
      z-index: 1;
    }

    .file-icon {
      font-size: 2.5rem;
    }

    .file-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }

    .file-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1rem;
    }

    .file-size {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .btn-remove {
      margin-left: auto;
      width: 36px;
      height: 36px;
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-sm);
      background: var(--bg-secondary);
      color: var(--text-secondary);
      font-size: 1rem;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-remove:hover {
      border-color: var(--status-abnormal);
      color: var(--status-abnormal);
      background: var(--status-abnormal-bg);
    }

    .text-zone {
      padding: var(--space-lg);
    }

    .text-input {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-sm);
      padding: var(--space-md);
      font-family: var(--font-sans);
      font-size: 0.9rem;
      color: var(--text-primary);
      line-height: 1.6;
      resize: vertical;
      transition: border-color var(--transition-fast);
    }

    .text-input::placeholder {
      color: var(--text-muted);
    }

    .text-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
    }

    .analyze-btn {
      margin-top: var(--space-lg);
      width: 100%;
      padding: var(--space-md) var(--space-xl);
      font-size: 1.05rem;
    }

    .btn-icon-text {
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .drop-zone {
        padding: var(--space-2xl) var(--space-md);
      }
    }
  `]
})
export class UploadZoneComponent {
    @Output() analyzeFile = new EventEmitter<File>();
    @Output() analyzeText = new EventEmitter<string>();

    activeTab: 'file' | 'text' = 'file';
    selectedFile: File | null = null;
    reportText = '';
    isDragging = false;

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.selectedFile = files[0];
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        }
    }

    removeFile(event: Event) {
        event.stopPropagation();
        this.selectedFile = null;
    }

    canAnalyze(): boolean {
        if (this.activeTab === 'file') {
            return this.selectedFile !== null;
        }
        return this.reportText.trim().length > 10;
    }

    onAnalyze() {
        if (this.activeTab === 'file' && this.selectedFile) {
            this.analyzeFile.emit(this.selectedFile);
        } else if (this.activeTab === 'text' && this.reportText.trim()) {
            this.analyzeText.emit(this.reportText.trim());
        }
    }

    getFileIcon(): string {
        if (!this.selectedFile) return '📄';
        const name = this.selectedFile.name.toLowerCase();
        if (name.endsWith('.pdf')) return '📕';
        if (name.match(/\.(jpg|jpeg|png|tiff|bmp)$/)) return '🖼️';
        return '📄';
    }

    formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }
}
