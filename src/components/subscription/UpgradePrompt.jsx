import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, Crown } from 'lucide-react';

export default function UpgradePrompt({
    feature = 'this feature',
    requiredPlan = 'Pro',
    compact = false
}) {
    const navigate = useNavigate();

    if (compact) {
        return (
            <div className="flex items-center gap-2 p-2 bg-indus-500/10 border border-indus-500/30 rounded-md">
                <Lock size={14} className="text-indus-400" />
                <span className="text-xs text-indus-300">
                    {requiredPlan} plan required
                </span>
                <button
                    onClick={() => navigate('/')}
                    className="text-xs text-indus-400 hover:text-indus-300 underline ml-auto"
                >
                    Upgrade
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-indus-500/10 to-slate-900 border border-indus-500/30 rounded-xl text-center"
        >
            <div className="w-16 h-16 bg-indus-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-indus-400" size={32} />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
                Unlock {feature}
            </h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                Upgrade to {requiredPlan} to access {feature} and other powerful features.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-indus-500 text-white font-semibold rounded-lg hover:bg-indus-600 transition-all flex items-center justify-center gap-2"
                >
                    <Zap size={18} />
                    View Plans
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-all"
                >
                    Maybe Later
                </button>
            </div>

            <p className="text-xs text-slate-500 mt-4">
                Cancel anytime. No hidden fees.
            </p>
        </motion.div>
    );
}
