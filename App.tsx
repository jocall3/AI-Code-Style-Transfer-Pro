
import React, { useState, useCallback, useEffect } from 'react';
import { SparklesIcon } from './components/Icons';
import { LoadingSpinner, MarkdownRenderer } from './components/Shared';
import { CodeAnalysisReportViewer } from './components/CodeAnalysisReportViewer';
import { CodeDiffViewer } from './components/CodeDiffViewer';
import { 
    exampleCode, 
    exampleStyleGuide, 
    MAX_CODE_LENGTH, 
    MAX_STYLE_GUIDE_LENGTH,
    DEFAULT_AI_TEMPERATURE,
    DEFAULT_AI_TOP_P,
    DEFAULT_AI_MAX_TOKENS
} from './constants';
import { 
    AiModelConfig, 
    CodeAnalysisReport, 
    StyleGuidePreset, 
    FeatureFlags,
    AiFeedback 
} from './types';
import { transferCodeStyleStream, analyzeCodeWithAi, generateText } from './services/geminiService';

const App: React.FC = () => {
    // --- State ---
    const [inputCode, setInputCode] = useState(exampleCode);
    const [styleGuide, setStyleGuide] = useState(exampleStyleGuide);
    const [outputCode, setOutputCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [analysisReport, setAnalysisReport] = useState<CodeAnalysisReport | null>(null);
    const [showDiff, setShowDiff] = useState(false);
    const [modelId, setModelId] = useState('gemini-3-pro-preview');
    const [activeTab, setActiveTab] = useState<'editor' | 'report'>('editor');

    const [modelConfig, setModelConfig] = useState<AiModelConfig>({
        modelId,
        temperature: DEFAULT_AI_TEMPERATURE,
        topP: DEFAULT_AI_TOP_P,
        maxTokens: DEFAULT_AI_MAX_TOKENS,
        retries: 3,
        timeoutMs: 120000,
        stream: true
    });

    // --- Handlers ---
    const handleTransfer = async () => {
        if (!inputCode.trim() || !styleGuide.trim()) {
            setError('Code and Style Guide are mandatory inputs.');
            return;
        }

        setIsLoading(true);
        setError('');
        setOutputCode('');
        setShowDiff(false);

        try {
            const stream = transferCodeStyleStream(modelId, inputCode, styleGuide, modelConfig);
            let fullText = '';
            for await (const chunk of stream) {
                fullText += chunk;
                setOutputCode(fullText);
            }
            
            // Post-transfer analysis
            const cleanCode = fullText.replace(/```(?:\w+)?\n([\s\S]*?)```/g, '$1');
            const report = await analyzeCodeWithAi(cleanCode, 'Detect Language');
            setAnalysisReport(report);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during processing.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setInputCode('');
        setStyleGuide('');
        setOutputCode('');
        setAnalysisReport(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-8 h-8 text-indigo-200" />
                        <h1 className="text-xl font-extrabold tracking-tight">AI CODE STYLE PRO <span className="text-indigo-300 font-medium text-sm ml-2 px-2 py-0.5 border border-indigo-400/30 rounded">V2.5 ENTERPRISE</span></h1>
                    </div>
                    <nav className="flex items-center gap-6 text-sm font-semibold">
                        <button onClick={() => setActiveTab('editor')} className={`transition-colors ${activeTab === 'editor' ? 'text-white border-b-2 border-white pb-1' : 'text-indigo-100 hover:text-white'}`}>Style Studio</button>
                        <button onClick={() => setActiveTab('report')} className={`transition-colors ${activeTab === 'report' ? 'text-white border-b-2 border-white pb-1' : 'text-indigo-100 hover:text-white'}`}>Compliance Reports</button>
                    </nav>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto w-full p-4 lg:p-8 flex flex-col gap-8">
                {activeTab === 'editor' ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Input Column */}
                            <div className="space-y-6">
                                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Source Code Fragment</h2>
                                        <span className="text-xs text-slate-400 font-mono">{inputCode.length} / {MAX_CODE_LENGTH}</span>
                                    </div>
                                    <textarea 
                                        className="w-full h-80 font-mono text-sm p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={inputCode}
                                        onChange={(e) => setInputCode(e.target.value)}
                                        placeholder="Paste your source code here..."
                                    />
                                </section>

                                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Style Directives</h2>
                                        <span className="text-xs text-slate-400 font-mono">{styleGuide.length} / {MAX_STYLE_GUIDE_LENGTH}</span>
                                    </div>
                                    <textarea 
                                        className="w-full h-40 font-mono text-sm p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        value={styleGuide}
                                        onChange={(e) => setStyleGuide(e.target.value)}
                                        placeholder="Define rules: e.g. use arrow functions, 2 space indent..."
                                    />
                                </section>

                                <div className="flex gap-4">
                                    <button 
                                        disabled={isLoading}
                                        onClick={handleTransfer}
                                        className="flex-grow bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl shadow-indigo-200 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        {isLoading ? <LoadingSpinner size="sm" /> : <><SparklesIcon className="w-5 h-5" /> REWRITE CODEBASE</>}
                                    </button>
                                    <button 
                                        onClick={handleClear}
                                        className="px-6 py-4 border border-slate-200 bg-white text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                                    >
                                        RESET
                                    </button>
                                </div>
                            </div>

                            {/* Output Column */}
                            <div className="flex flex-col h-full space-y-6">
                                <section className="flex-grow bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Harmonized Output</h2>
                                        {outputCode && (
                                            <button 
                                                onClick={() => setShowDiff(!showDiff)} 
                                                className="text-xs font-bold text-indigo-600 hover:underline"
                                            >
                                                {showDiff ? 'VIEW RENDERED' : 'VIEW DIFFERENCES'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-grow rounded-xl overflow-hidden bg-slate-900 min-h-[500px]">
                                        {error ? (
                                            <div className="p-8 text-rose-400 font-medium">Error: {error}</div>
                                        ) : outputCode ? (
                                            showDiff ? (
                                                <CodeDiffViewer originalCode={inputCode} newCode={outputCode} />
                                            ) : (
                                                <div className="p-0 overflow-auto h-full">
                                                    <MarkdownRenderer content={outputCode} />
                                                </div>
                                            )
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-slate-500 italic text-sm p-8 text-center">
                                                Harmonized code output will appear here after AI processing.
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {analysisReport && <CodeAnalysisReportViewer report={analysisReport} />}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="space-y-8">
                        {analysisReport ? (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-extrabold text-slate-800">Operational Compliance Report</h2>
                                <CodeAnalysisReportViewer report={analysisReport} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                        <h3 className="font-bold mb-4">Functional Complexity Heatmap</h3>
                                        <div className="h-48 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            [Visual Map Placeholder]
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                        <h3 className="font-bold mb-4">Adherence Timeline</h3>
                                        <div className="h-48 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            [Timeline Placeholder]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <SparklesIcon className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-lg">No active session reports available. Complete a transfer to generate data.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12 px-4 mt-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-500 text-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <SparklesIcon className="w-5 h-5 text-indigo-500" />
                            <span className="font-bold text-slate-800 uppercase tracking-widest">Style Pro</span>
                        </div>
                        <p className="leading-relaxed">Advanced AI-driven code stylistic transformation engine. Part of the Citibank Demo Business Inc suite for engineering excellence.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs">Security & Compliance</h4>
                        <ul className="space-y-2">
                            <li>AES-256 Code Encryption</li>
                            <li>Snyk Security Integration</li>
                            <li>SOC2 Type II Compliance</li>
                            <li>Privacy-first AI Processing</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs">Enterprise Support</h4>
                        <ul className="space-y-2">
                            <li>24/7 Priority Integration</li>
                            <li>Custom Model Fine-tuning</li>
                            <li>SSO / SAML Configuration</li>
                            <li>On-Premise Deployment</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
                    <p>&copy; 2024 Citibank Demo Business Inc. | All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">SLA Agreements</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">API Documentation</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
