# PatientVocate 🩺

**AI-Powered Medical Report Education Platform**

PatientVocate bridges the gap between complex medical lab reports and patient understanding. It transforms raw medical data into clear, supportive, and educational summaries, helping patients prepare for meaningful conversations with their healthcare providers.

---

## ✨ Features

- **📄 Smart Extraction**: Supports drag-and-drop PDFs and high-accuracy OCR for images (JPG, PNG).
- **🧠 Advanced AI Analysis**: 
  - **Cloud (Default)**: Leverages **OpenRouter (Trinity Large / DeepSeek / Gemma 3)** for high-reasoning summaries.
  - **Local**: Supports **Ollama** (e.g., Qwen2.5-Coder) for 100% private, on-device processing.
- **🔬 Categorized Findings**: Highlights results as Abnormal, Borderline, or Normal using a clinical-grade educational tone.
- **📖 Contextual Glossary**: Automatically defines complex medical terms found in the report.
- **💬 Guided Dialogue**: Generates specific, actionable questions for your next doctor's visit.
- **📱 Premium UX**: Stunning dark-mode dashboard with glassmorphism and smooth micro-animations.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Java 17, Spring Boot 3.x
- **Libraries**: Apache PDFBox (PDF parsing), Tesseract OCR (Image processing via Tess4J)
- **AI Integration**: OpenRouter API (Cloud), Ollama API (Local)

### Frontend
- **Framework**: Angular 17+
- **Styling**: Vanilla CSS3 (Custom design system, No Tailwind)
- **State Management**: Reactive services with RxJS

---

## 🚀 Quick Start

### 1. Prerequisites
- **Java 17+** (JDK)
- **Node.js & npm** (v18+)
- **OpenRouter API Key**: Get one at [openrouter.ai](https://openrouter.ai)
- **Ollama** (Optional): Install from [ollama.com](https://ollama.com) if using local models.

### 2. Configuration
Update `backend/src/main/resources/application.yml` with your API key:
```yaml
ai:
  openrouter:
    api-key: "your_sk_or_key_here"
    model: "arcee-ai/trinity-large-preview:free" # or your preferred model
```

### 3. Running the Application

#### **Backend**
```bash
cd backend
./mvnw.cmd spring-boot:run
```

#### **Frontend**
```bash
cd frontend
npm install
npm start
```
Go to `http://localhost:4200` to start analyzing.

---

## 🏗️ Production Deployment

### Building for Production

1. **Backend**: Generate a runnable JAR:
   ```bash
   cd backend
   ./mvnw.cmd clean package
   ```
   The JAR will be in `backend/target/patientvocate-backend.jar`.

2. **Frontend**: Generate optimized static files:
   ```bash
   cd frontend
   npm run build --prod
   ```
   Deploy the contents of `frontend/dist/` to any web server (Nginx, S3, etc.).

---

## ⚠️ Troubleshooting

- **"No endpoints found matching your data policy"**:
  If using certain free models on OpenRouter, ensure your [Privacy Settings](https://openrouter.ai/settings/privacy) allow "Free Model Publication" or "Prompts Sharing."
- **OCR Issues (Linux/WSL)**:
  Install the native Tesseract package: `sudo apt install tesseract-ocr`.
- **JSON Parsing Errors**:
  PatientVocate includes a "bulletproof" JSON cleaner, but if an AI model is extremely verbose, try switching to a more stable model like `google/gemini-2.0-flash-exp:free`.

---

**Medical Disclaimer**: PatientVocate is for **educational purposes only**. It does not provide medical diagnoses, treatment recommendations, or clinical advice. Always consult your healthcare professional to interpret your results in the context of your medical history.
