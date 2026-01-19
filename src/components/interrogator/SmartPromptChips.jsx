import { motion } from 'framer-motion';
import { Sparkles, FileSearch, AlertTriangle, TrendingUp, BookOpen, FileWarning } from 'lucide-react';

const noDocumentPrompts = [
    {
        text: 'Analyze Market Trends',
        icon: TrendingUp,
        prompt: 'Analyze current market trends and provide insights on major indices, sector performance, and key economic indicators affecting the Indian stock market.'
    },
    {
        text: 'Summarize Sector Risks',
        icon: AlertTriangle,
        prompt: 'Summarize the key risks across major sectors in the current market environment, including Technology, Healthcare, Financial, and Energy sectors.'
    }
];

const withDocumentPrompts = [
    {
        text: 'Summarize Management Outlook',
        icon: BookOpen,
        prompt: 'Summarize the management\'s outlook and future guidance from this document. Include their expectations for revenue growth, market expansion, and strategic initiatives.'
    },
    {
        text: 'Extract Key Risk Factors',
        icon: AlertTriangle,
        prompt: 'Extract and list all key risk factors mentioned in this document. Categorize them by type (operational, financial, market, regulatory) and assess their potential impact.'
    },
    {
        text: 'List Red Flags in Footnotes',
        icon: FileWarning,
        prompt: 'Analyze the footnotes and disclosures in this document. Identify any red flags, unusual accounting practices, or concerning items that investors should be aware of.'
    },
    {
        text: 'Financial Health Check',
        icon: FileSearch,
        prompt: 'Perform a comprehensive financial health check based on this document. Analyze key ratios, cash flow patterns, debt levels, and profitability trends.'
    }
];

export default function SmartPromptChips({ hasDocument, onPromptSelect }) {
    const prompts = hasDocument ? withDocumentPrompts : noDocumentPrompts;

    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-indus-400" />
                <span className="text-xs font-medium text-slate-400">
                    {hasDocument ? 'Ask about your document' : 'Quick prompts'}
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {prompts.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onPromptSelect(item.prompt)}
                            className="flex items-center gap-2 px-3 py-2 bg-indus-500/10 hover:bg-indus-500/20 
                                       border border-indus-500/30 hover:border-indus-500/50 
                                       rounded-full text-sm text-indus-400 hover:text-indus-300 
                                       transition-all cursor-pointer"
                        >
                            <Icon size={14} />
                            <span>{item.text}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
