export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    className = '',
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-slate-300">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
          bg-slate-900 border border-slate-700
          rounded-md px-3 py-2
          text-slate-100 placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-indus-500/50 focus:border-indus-500
          transition-colors duration-200
          ${className}
        `}
                {...props}
            />
        </div>
    );
}
