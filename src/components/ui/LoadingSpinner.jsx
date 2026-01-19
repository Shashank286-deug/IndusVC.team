import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = '' }) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
                {/* Outer ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className={`${sizes[size]} rounded-full border-2 border-indus-500/20 border-t-indus-500`}
                />

                {/* Inner pulse */}
                <motion.div
                    animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="w-2 h-2 bg-indus-500 rounded-full" />
                </motion.div>
            </div>

            {text && (
                <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-sm text-slate-400"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}

export function SkeletonLoader({ className = '', lines = 3 }) {
    return (
        <div className={`space-y-3 ${className}`}>
            {[...Array(lines)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: i * 0.1
                    }}
                    className="h-4 rounded-md"
                    style={{
                        background: 'linear-gradient(90deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
                        backgroundSize: '200% 100%',
                        width: i === lines - 1 ? '60%' : '100%'
                    }}
                />
            ))}
        </div>
    );
}

export function PulsingDot({ color = 'indus' }) {
    const colors = {
        indus: 'bg-indus-500',
        green: 'bg-profit',
        red: 'bg-loss',
        yellow: 'bg-yellow-500'
    };

    return (
        <span className="relative flex h-3 w-3">
            <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute inline-flex h-full w-full rounded-full ${colors[color]} opacity-75`}
            />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[color]}`} />
        </span>
    );
}
