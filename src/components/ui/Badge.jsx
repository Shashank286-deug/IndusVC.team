export default function Badge({ children, variant = 'default', className = '' }) {
    const variants = {
        default: 'bg-slate-800 text-slate-300 border-slate-700',
        low: 'bg-profit/10 text-profit border-profit/20',
        medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        high: 'bg-loss/10 text-loss border-loss/20',
        profit: 'bg-profit/10 text-profit border-profit/20',
        loss: 'bg-loss/10 text-loss border-loss/20',
    };

    return (
        <span className={`
      ${variants[variant]}
      inline-flex items-center px-2.5 py-0.5 rounded-sm
      text-xs font-medium border
      ${className}
    `}>
            {children}
        </span>
    );
}
