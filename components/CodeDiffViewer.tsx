
import React, { useState, useEffect } from 'react';
import { CodeDiff } from '../types';
import { LoadingSpinner } from './Shared';

export const CodeDiffViewer: React.FC<{ originalCode: string; newCode: string }> = ({ originalCode, newCode }) => {
    const [diffs, setDiffs] = useState<CodeDiff[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const origLines = originalCode.split('\n');
            const newLines = newCode.split('\n');
            const result: CodeDiff[] = [];
            const maxLen = Math.max(origLines.length, newLines.length);

            for (let i = 0; i < maxLen; i++) {
                const ol = origLines[i];
                const nl = newLines[i];
                if (ol === nl) {
                    result.push({ originalLine: i + 1, newLine: i + 1, type: 'unchanged', content: ol || '' });
                } else {
                    if (ol !== undefined) result.push({ originalLine: i + 1, newLine: -1, type: 'removed', content: ol });
                    if (nl !== undefined) result.push({ originalLine: -1, newLine: i + 1, type: 'added', content: nl });
                }
            }
            setDiffs(result);
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [originalCode, newCode]);

    if (loading) return <div className="p-12"><LoadingSpinner className="mx-auto" /></div>;

    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 py-2 text-xs font-bold text-slate-400 border-b border-slate-700 flex justify-between">
                <span>Transformation Comparison</span>
                <span className="flex gap-4">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-rose-500 rounded-full"></span> Removed</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Added</span>
                </span>
            </div>
            <div className="font-mono text-xs overflow-x-auto p-4 max-h-[600px]">
                <table className="w-full border-collapse">
                    <tbody>
                        {diffs.map((d, i) => (
                            <tr key={i} className={`${d.type === 'added' ? 'bg-emerald-900/30' : d.type === 'removed' ? 'bg-rose-900/30' : ''}`}>
                                <td className="w-10 text-right pr-4 text-slate-600 select-none border-r border-slate-800">{d.originalLine > 0 ? d.originalLine : ''}</td>
                                <td className="w-10 text-right pr-4 text-slate-600 select-none border-r border-slate-800">{d.newLine > 0 ? d.newLine : ''}</td>
                                <td className={`pl-4 whitespace-pre ${d.type === 'added' ? 'text-emerald-400' : d.type === 'removed' ? 'text-rose-400' : 'text-slate-300'}`}>
                                    {d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '}{d.content}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
