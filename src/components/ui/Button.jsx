import { motion } from 'framer-motion';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
    disabled = false,
    icon: Icon
}) {
    const variants = {
        primary: 'bg-indus-500 hover:bg-indus-600 text-white border-transparent',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700',
        ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 border-transparent',
        danger: 'bg-loss hover:bg-loss-dark text-white border-transparent',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={onClick}
            disabled={disabled}
            className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-md border font-medium
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2 justify-center
        ${className}
      `}
        >
            {Icon && <Icon size={18} />}
            {children}
        </motion.button>
    );
}
