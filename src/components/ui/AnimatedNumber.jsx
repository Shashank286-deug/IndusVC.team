import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedNumber({
    value,
    duration = 1000,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = ''
}) {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    useEffect(() => {
        if (!isInView) return;

        const startTime = Date.now();
        const startValue = 0;
        const endValue = numericValue;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (endValue - startValue) * eased;

            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, numericValue, duration]);

    const formattedValue = decimals > 0
        ? displayValue.toFixed(decimals)
        : Math.round(displayValue).toLocaleString();

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3 }}
        >
            {prefix}{formattedValue}{suffix}
        </motion.span>
    );
}

// Percentage with animated bar
export function AnimatedPercentage({ value, color = 'indus', showBar = true }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const colors = {
        indus: 'bg-indus-500',
        green: 'bg-profit',
        red: 'bg-loss',
        yellow: 'bg-yellow-500'
    };

    return (
        <div ref={ref} className="space-y-1">
            <div className="flex justify-between items-center">
                <motion.span
                    className="font-mono font-semibold"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                >
                    <AnimatedNumber value={value} suffix="%" decimals={1} />
                </motion.span>
            </div>
            {showBar && (
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full ${colors[color]}`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${Math.min(value, 100)}%` } : {}}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    />
                </div>
            )}
        </div>
    );
}
