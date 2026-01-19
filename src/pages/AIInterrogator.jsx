import { useState } from 'react';
import PDFViewer from '../components/interrogator/PDFViewer';
import ChatInterface from '../components/interrogator/ChatInterface';
import UpgradePrompt from '../components/subscription/UpgradePrompt';
import TokenUsageBar from '../components/subscription/TokenUsageBar';
import { useSubscription } from '../context/SubscriptionContext';
import { isApiConfigured } from '../lib/pdfAnalysisService';
import { Brain, Zap } from 'lucide-react';

export default function AIInterrogator() {
    const [documentFile, setDocumentFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [financialData, setFinancialData] = useState(null);

    const { hasFeature, canUseAI, currentPlan, tokensRemaining, isUnlimited } = useSubscription();

    const handleDocumentLoad = (file) => {
        setDocumentFile(file);
        setAnalysis(null);
        setFinancialData(null);
    };

    const handleAnalysisComplete = (result) => {
        setAnalysis(result.analysis);
        setFinancialData(result.financialData);
    };

    // Check if user has access to AI Interrogator
    const hasAccess = hasFeature('aiInterrogator');

    // Show upgrade prompt for users without access
    if (!hasAccess) {
        return (
            <div className="p-8 h-full">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                        <Brain className="text-indus-500" size={32} />
                        AI <span className="gradient-text">Interrogator</span>
                    </h1>
                    <p className="text-slate-400">
                        Upload financial documents for AI-powered analysis using Gemini
                    </p>
                </div>

                <div className="max-w-lg mx-auto mt-12">
                    <UpgradePrompt
                        feature="AI Interrogator"
                        requiredPlan="Pro"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 h-full">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                            <Brain className="text-indus-500" size={32} />
                            AI <span className="gradient-text">Interrogator</span>
                        </h1>
                        <p className="text-slate-400">
                            Upload financial documents for AI-powered analysis using Gemini
                            {!isApiConfigured() && (
                                <span className="text-yellow-500 ml-2">(Add API key for live analysis)</span>
                            )}
                        </p>
                    </div>

                    {/* Token Usage Indicator */}
                    {!isUnlimited && (
                        <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-2">
                            <Zap size={16} className="text-indus-400" />
                            <div className="text-sm">
                                <span className="text-slate-400">Tokens: </span>
                                <span className="text-white font-mono">
                                    {tokensRemaining.toLocaleString()} remaining
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Token usage warning */}
                {!canUseAI && currentPlan === 'pro' && (
                    <div className="mt-4 p-3 bg-loss/10 border border-loss/30 rounded-md">
                        <p className="text-sm text-loss">
                            You've used all your AI tokens for this month. Upgrade to Organization plan for unlimited access.
                        </p>
                    </div>
                )}
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 'calc(100vh - 280px)' }}>
                <PDFViewer
                    onDocumentLoad={handleDocumentLoad}
                    onAnalysisComplete={handleAnalysisComplete}
                    currentFile={documentFile}
                />
                <ChatInterface
                    documentFile={documentFile}
                    initialAnalysis={analysis}
                    financialData={financialData}
                />
            </div>
        </div>
    );
}

