import { motion } from 'framer-motion';

export default function Card({
    children,
    className = '',
    hover = false,
    glass = false,
    animate = false,
    delay = 0
}) {
    const baseClasses = glass
        ? 'glass-card p-6'
        : 'bg-slate-900 border border-slate-800 rounded-md p-6';

    const Component = hover || animate ? motion.div : 'div';

    const hoverProps = hover ? {
        whileHover: {
            scale: 1.02,
            y: -4,
            borderColor: 'rgba(249, 115, 22, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(249, 115, 22, 0.1)'
        },
        whileTap: { scale: 0.98 },
        transition: { type: 'spring', stiffness: 400, damping: 17 }
    } : {};

    const animateProps = animate ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, duration: 0.4, ease: 'easeOut' }
    } : {};

    return (
        <Component
            className={`${baseClasses} ${className} ${hover ? 'cursor-pointer' : ''}`}
            {...hoverProps}
            {...animateProps}
        >
            {children}
        </Component>
    );
}

// Animated card with glow effect
export function GlowCard({ children, className = '', color = 'indus' }) {
    const colors = {
        indus: 'hover:shadow-indus-500/20',
        green: 'hover:shadow-profit/20',
        purple: 'hover:shadow-purple-500/20'
    };

    return (
        <motion.div
            className={`
                relative bg-slate-900 border border-slate-800 rounded-md p-6 
                transition-all duration-300 overflow-hidden
                hover:border-indus-500/50 ${colors[color]}
                ${className}
            `}
            whileHover={{
                scale: 1.02,
                boxShadow: '0 0 30px rgba(249, 115, 22, 0.2)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {/* Animated gradient border */}
            <motion.div
                className="absolute inset-0 rounded-md opacity-0"
                style={{
                    background: 'linear-gradient(45deg, transparent, rgba(249, 115, 22, 0.1), transparent)',
                    backgroundSize: '200% 200%'
                }}
                whileHover={{
                    opacity: 1,
                    backgroundPosition: ['0% 0%', '100% 100%']
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
