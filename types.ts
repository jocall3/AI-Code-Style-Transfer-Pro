
export enum FeatureFlags {
    ADVANCED_CODE_METRICS = 'advancedCodeMetrics',
    PREDEFINED_STYLE_GUIDES = 'predefinedStyleGuides',
    AI_EXPLAINABILITY = 'aiExplainability',
    VERSION_CONTROL_INTEGRATION = 'versionControlIntegration',
    MULTI_MODEL_SUPPORT = 'multiModelSupport',
    REALTIME_COLLABORATION = 'realtimeCollaboration',
    STYLE_GUIDE_GENERATOR = 'styleGuideGenerator',
    SECURITY_SCANNER_INTEGRATION = 'securityScannerIntegration',
    USAGE_ANALYTICS = 'usageAnalytics',
    ENTERPRISE_SSO = 'enterpriseSSO',
    DATA_MASKING = 'dataMasking',
    CODE_QUALITY_GATE = 'codeQualityGate',
    CODE_DIFF_VIEWER = 'codeDiffViewer',
    BACKGROUND_TASK_PROCESSING = 'backgroundTaskProcessing',
    ADVANCED_NOTIFICATION_SYSTEM = 'advancedNotificationSystem',
    AI_FEEDBACK_LOOP = 'aiFeedbackLoop',
}

export interface AiModel {
    id: string;
    name: string;
    description: string;
    capabilities: string[];
    rateLimitPerHour?: number;
    costPerMillionTokensInput?: number;
    costPerMillionTokensOutput?: number;
    supportedLanguages: string[];
}

export interface AiModelConfig {
    modelId: string;
    temperature: number;
    topP: number;
    maxTokens: number;
    retries: number;
    timeoutMs: number;
    stream: boolean;
}

export interface StyleGuidePreset {
    id: string;
    name: string;
    description: string;
    content: string;
    isUserDefined: boolean;
    language?: string;
    tags?: string[];
    version?: string;
    createdAt: string;
    lastModified: string;
    authorId?: string;
}

export interface CodeAnalysisReport {
    language: string;
    linesOfCode: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    technicalDebtHours?: number;
    warnings: CodeIssue[];
    errors: CodeIssue[];
    securityVulnerabilities: CodeIssue[];
    functionMetrics?: { name: string; complexity: number; loc: number; params: number }[];
    styleComplianceScore: number;
}

export interface CodeIssue {
    severity: 'error' | 'warning' | 'info' | 'security';
    message: string;
    line: number;
    column: number;
    ruleId?: string;
    suggestion?: string;
    codeSnippet?: string;
}

export interface CodeDiff {
    originalLine: number;
    newLine: number;
    type: 'added' | 'removed' | 'changed' | 'unchanged';
    content: string;
}

export interface UserPreferences {
    defaultAiModelId: string;
    defaultStyleGuideId?: string;
    preferredLanguages: string[];
    theme: 'light' | 'dark' | 'system';
    enableAutoSave: boolean;
    notificationSettings: {
        emailOnCompletion: boolean;
        inAppAlerts: boolean;
        slackNotifications: boolean;
    };
    integrations: {
        githubAccessToken?: string;
        jiraApiToken?: string;
        slackWebhookUrl?: string;
        snykApiToken?: string;
    };
    lastLogin: string;
}

export interface BackgroundTask {
    id: string;
    type: 'styleTransfer' | 'codeAnalysis' | 'styleGuideGeneration' | 'testExecution' | 'codeOptimization';
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    startTime: string;
    endTime?: string;
    result?: any;
    error?: string;
    userId: string;
}

export interface AiFeedback {
    id: string;
    userId: string;
    modelId: string;
    transferId: string;
    rating: number;
    comments: string;
    timestamp: string;
}
