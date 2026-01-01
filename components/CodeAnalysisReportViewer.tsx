
import React from 'react';
import { CodeAnalysisReport } from '../types';
import { SparklesIcon, AlertIcon } from './Icons';

export const CodeAnalysisReportViewer: React.FC<{ report: CodeAnalysisReport | null }> = ({ report }) => {
    if (!report) return null;

    const hasIssues = report.errors?.length > 0 || report.warnings?.length > 0 || report.securityVulnerabilities?.length > 0;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-8 shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center text-slate-800">
                AI Intelligence Insights
                {hasIssues ? (
                    <span className="ml-3 px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 rounded-full">Concerns Identified</span>
                ) : (
                    <span className="ml-3 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full">Optimized Health</span>
                )}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                <Metric label="Language" value={report.language} />
                <Metric label="Lines of Code" value={report.linesOfCode} />
                <Metric label="Complexity" value={report.cyclomaticComplexity} />
                <Metric label="Maintainability" value={`${report.maintainabilityIndex}/100`} />
                <Metric label="Tech Debt" value={`${report.technicalDebtHours}h`} />
                <Metric label="Style Compliance" value={`${report.styleComplianceScore}%`} />
            </div>

            {(report.securityVulnerabilities?.length > 0 || report.errors?.length > 0) && (
                <div className="space-y-4 border-t border-slate-100 pt-6">
                    <h4 className="font-bold text-slate-700 mb-3">Priority Findings</h4>
                    {report.securityVulnerabilities?.map((v, i) => (
                        <div key={i} className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
                            <div className="flex items-center text-rose-800 font-semibold text-sm mb-1">
                                <AlertIcon className="w-4 h-4 mr-2" />
                                Security: {v.message}
                            </div>
                            <p className="text-rose-700 text-xs italic ml-6">L{v.line}: {v.suggestion}</p>
                        </div>
                    ))}
                    {report.errors?.map((e, i) => (
                        <div key={i} className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                            <div className="flex items-center text-amber-800 font-semibold text-sm mb-1">
                                <AlertIcon className="w-4 h-4 mr-2" />
                                Logic Error: {e.message}
                            </div>
                            <p className="text-amber-700 text-xs italic ml-6">L{e.line}: {e.suggestion}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Metric = ({ label, value }: { label: string, value: string | number }) => (
    <div>
        <div className="text-xs text-slate-500 uppercase font-bold mb-1">{label}</div>
        <div className="text-lg text-slate-800 font-semibold">{value}</div>
    </div>
);
