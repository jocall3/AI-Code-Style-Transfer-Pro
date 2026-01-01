
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CodeAnalysisReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function* transferCodeStyleStream(
    modelId: string, 
    code: string, 
    styleGuide: string, 
    config: any
) {
    const prompt = `You are an expert software engineer. Rewrite the following code strictly following the provided style guide. Ensure the logic remains identical.
    
    ### Original Code:
    \`\`\`
    ${code}
    \`\`\`
    
    ### Style Guide:
    ${styleGuide}
    
    Return ONLY the rewritten code wrapped in a markdown code block.`;

    const responseStream = await ai.models.generateContentStream({
        model: modelId,
        contents: prompt,
        config: {
            temperature: config.temperature,
            topP: config.topP,
            maxOutputTokens: config.maxTokens,
            thinkingConfig: { thinkingBudget: 0 }
        },
    });

    for await (const chunk of responseStream) {
        if (chunk.text) {
            yield chunk.text;
        }
    }
}

export async function analyzeCodeWithAi(code: string, language: string): Promise<CodeAnalysisReport> {
    const prompt = `Perform a comprehensive static analysis of the following ${language} code. 
    Evaluate cyclomatic complexity, maintainability, technical debt, and identify security vulnerabilities (OWASP TOP 10).
    Code:
    \`\`\`
    ${code}
    \`\`\``;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    language: { type: Type.STRING },
                    linesOfCode: { type: Type.NUMBER },
                    cyclomaticComplexity: { type: Type.NUMBER },
                    maintainabilityIndex: { type: Type.NUMBER },
                    technicalDebtHours: { type: Type.NUMBER },
                    styleComplianceScore: { type: Type.NUMBER },
                    warnings: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                severity: { type: Type.STRING },
                                message: { type: Type.STRING },
                                line: { type: Type.NUMBER },
                                column: { type: Type.NUMBER },
                                suggestion: { type: Type.STRING },
                                codeSnippet: { type: Type.STRING }
                            }
                        }
                    },
                    errors: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                severity: { type: Type.STRING },
                                message: { type: Type.STRING },
                                line: { type: Type.NUMBER },
                                column: { type: Type.NUMBER },
                                suggestion: { type: Type.STRING }
                            }
                        }
                    },
                    securityVulnerabilities: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                severity: { type: Type.STRING },
                                message: { type: Type.STRING },
                                line: { type: Type.NUMBER },
                                column: { type: Type.NUMBER },
                                ruleId: { type: Type.STRING },
                                suggestion: { type: Type.STRING },
                                codeSnippet: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });

    return JSON.parse(response.text || '{}');
}

export async function generateText(modelId: string, prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
    });
    return response.text || '';
}
