import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlertBanner({ severity = 'high', title, message, recommendation, onDismiss }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    const severityStyles = {
        high: 'bg-loss/10 border-loss/30 text-loss',
        medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500',
        low: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`
            ${severityStyles[severity]}
            border rounded-md p-4
            flex items-start gap-3
          `}
                >
                    <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />

                    <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{title}</h4>
                        <p className="text-sm text-slate-300 mb-2">{message}</p>
                        {recommendation && (
                            <p className="text-sm text-slate-400">
                                <span className="font-medium">Recommendation:</span> {recommendation}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 p-1 hover:bg-white/10 rounded-md transition-colors"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
