import { motion } from 'framer-motion';
import { Flame, Minus, ChevronDown } from 'lucide-react';

const impactStyles = {
    high: {
        bg: 'bg-loss/20',
        text: 'text-loss',
        border: 'border-loss/30',
        icon: Flame
    },
    medium: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/30',
        icon: Minus
    },
    low: {
        bg: 'bg-profit/20',
        text: 'text-profit',
        border: 'border-profit/30',
        icon: ChevronDown
    }
};

export default function ImpactBadge({ impact = 'low' }) {
    const style = impactStyles[impact] || impactStyles.low;
    const Icon = style.icon;

    const labels = {
        high: 'High Impact',
        medium: 'Neutral',
        low: 'Low Impact'
    };

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium
                ${style.bg} ${style.text} border ${style.border}
            `}
        >
            <Icon size={10} />
            <span>{labels[impact]}</span>
        </motion.span>
    );
}

// Utility function to determine impact based on news content and portfolio holdings
export function calculateNewsImpact(headline, summary, portfolioSymbols = ['MSFT', 'NVDA', 'AAPL', 'UNH', 'JNJ', 'JPM', 'V', 'TSLA']) {
    const content = `${headline} ${summary}`.toLowerCase();

    // High impact keywords related to portfolio holdings
    const highImpactKeywords = [
        'banking', 'jpm', 'jpmorgan', 'technology', 'ai', 'artificial intelligence',
        'msft', 'microsoft', 'nvda', 'nvidia', 'aapl', 'apple', 'healthcare',
        'unh', 'unitedhealth', 'jnj', 'johnson', 'rbi', 'interest rate', 'inflation',
        'nifty', 'sensex', 'fii', 'dii', 'earnings', 'quarterly results'
    ];

    // Medium impact keywords
    const mediumImpactKeywords = [
        'market', 'fed', 'interest rate', 'gdp', 'economy', 'global',
        'sector', 'index', 'trading', 'volatility', 'crude', 'oil'
    ];

    // Check for high impact
    for (const keyword of highImpactKeywords) {
        if (content.includes(keyword)) {
            return 'high';
        }
    }

    // Check for medium impact
    for (const keyword of mediumImpactKeywords) {
        if (content.includes(keyword)) {
            return 'medium';
        }
    }

    return 'low';
}
