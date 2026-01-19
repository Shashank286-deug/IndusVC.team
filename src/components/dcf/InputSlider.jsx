export default function InputSlider({ label, value, onChange, min, max, step, unit = '%' }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">{label}</label>
                <span className="text-sm font-mono font-semibold text-indus-400">
                    {value}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-md appearance-none cursor-pointer slider"
                style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${((value - min) / (max - min)) * 100}%, #334155 ${((value - min) / (max - min)) * 100}%, #334155 100%)`
                }}
            />
            <div className="flex justify-between text-xs text-slate-500">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );
}
