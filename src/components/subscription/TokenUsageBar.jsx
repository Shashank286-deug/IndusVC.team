import { motion } from 'framer-motion';
import { useSubscription } from '../../context/SubscriptionContext';
import { Zap, Infinity } from 'lucide-react';

export default function TokenUsageBar({ compact = false }) {
    const { tokensUsed, tokensLimit, tokensRemaining, usagePercentage, isUnlimited, currentPlan } = useSubscription();

    // Don't show for free plan
    if (currentPlan === 'free') {
        return null;
    }

    // Unlimited display
    if (isUnlimited) {
        return (
            <div className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
                <Infinity size={compact ? 14 : 16} className="text-indus-400" />
                <span className="text-slate-400">Unlimited tokens</span>
            </div>
        );
    }

    // Get color based on usage
    const getColor = () => {
        if (usagePercentage > 90) return 'bg-loss';
        if (usagePercentage > 70) return 'bg-yellow-500';
        return 'bg-indus-500';
    };

    return (
        <div className={compact ? '' : 'p-3 bg-slate-800/50 rounded-md'}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Zap size={compact ? 12 : 14} className="text-indus-400" />
                    <span className={`text-slate-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                        AI Tokens
                    </span>
                </div>
                <span className={`font-mono font-medium ${compact ? 'text-xs' : 'text-sm'} ${usagePercentage > 90 ? 'text-loss' : 'text-slate-300'
                    }`}>
                    {tokensRemaining.toLocaleString()} / {tokensLimit.toLocaleString()}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${getColor()}`}
                />
            </div>

            {!compact && usagePercentage > 80 && (
                <p className="text-xs text-yellow-400 mt-2">
                    Running low on tokens. Consider upgrading your plan.
                </p>
            )}
        </div>
    );
}
