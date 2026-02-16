export interface Finding {
    testName: string;
    value: string;
    referenceRange: string;
    status: 'NORMAL' | 'BORDERLINE' | 'ABNORMAL';
    explanation: string;
}

export interface GlossaryEntry {
    term: string;
    definition: string;
}

export interface DiscussionQuestion {
    question: string;
    context: string;
}

export interface ReportSummary {
    summary: string;
    findings: Finding[];
    glossary: GlossaryEntry[];
    discussionQuestions: DiscussionQuestion[];
    disclaimer: string;
}

export interface ReportAnalysisResponse {
    success: boolean;
    analysis: ReportSummary;
    reportText: string;
    error?: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    reportText: string;
    analysisSummary: string;
    question: string;
    conversationHistory: ChatMessage[];
}

export interface ChatResponse {
    success: boolean;
    answer: string;
    error?: string;
}

export interface HealthStatus {
    status: string;
    aiModel: {
        available: boolean;
        provider: string;
        model: string;
    };
}
