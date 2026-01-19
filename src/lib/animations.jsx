import { motion } from 'framer-motion';

// Page transition variants
export const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

export const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
};

// Stagger children animations
export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

// Fade in from different directions
export const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
};

export const fadeInDown = {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
};

export const fadeInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
};

export const fadeInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
};

// Scale animations
export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
};

export const popIn = {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 400, damping: 15 }
    }
};

// Hover animations
export const hoverScale = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
};

export const hoverLift = {
    whileHover: { y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
};

export const hoverGlow = {
    whileHover: {
        boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)',
        borderColor: 'rgba(249, 115, 22, 0.5)'
    },
    transition: { duration: 0.2 }
};

// Pulse animation for attention
export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// Shimmer loading effect
export const shimmer = {
    animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

// Floating animation
export const float = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

// Rotate animation
export const rotate = {
    animate: {
        rotate: 360,
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

// Counter animation component
export function AnimatedCounter({ value, duration = 1 }) {
    return (
        <motion.span
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {value}
        </motion.span>
    );
}

// Animated presence wrapper
export const AnimatedPresenceWrapper = ({ children, mode = 'wait' }) => (
    <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
    >
        {children}
    </motion.div>
);
