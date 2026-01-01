
import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-10 h-10'
    };
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full border-2 border-indigo-500 border-t-transparent ${sizeClasses[size]}`}></div>
        </div>
    );
};

export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Basic Markdown stripper/formatter for code blocks
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
    const match = codeBlockRegex.exec(content);
    const code = match ? match[1] : content.replace(/```/g, '');

    return (
        <pre className="font-mono text-sm p-4 whitespace-pre-wrap text-slate-100 bg-slate-900 rounded-md">
            <code>{code}</code>
        </pre>
    );
};
