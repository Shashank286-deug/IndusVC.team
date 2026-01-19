import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { calculateDCF } from '../../lib/dcfCalculator';
import { Grid3X3, Info } from 'lucide-react';

export default function SensitivityMatrix({ params, currentPrice }) {
    const [hoveredCell, setHoveredCell] = useState(null);

    // WACC and Terminal Growth variations: -1%, -0.5%, 0%, +0.5%, +1%
    const variations = [-1, -0.5, 0, 0.5, 1];

    // Calculate matrix of intrinsic values
    const matrix = useMemo(() => {
        const waccValues = variations.map(v => params.wacc + v);
        const tgValues = variations.map(v => params.terminalGrowth + v);

        return waccValues.map((wacc, rowIdx) => {
            return tgValues.map((tg, colIdx) => {
                // Ensure valid parameters (WACC must be > Terminal Growth)
                if (wacc <= tg || wacc <= 0 || tg < 0) {
                    return { value: null, wacc, tg };
                }

                const result = calculateDCF({
                    ...params,
                    wacc,
                    terminalGrowth: tg
                });

                const percentDiff = ((result.intrinsicValue - currentPrice) / currentPrice) * 100;

                return {
                    value: result.intrinsicValue,
                    wacc,
                    tg,
                    percentDiff,
                    isCenter: rowIdx === 2 && colIdx === 2
                };
            });
        });
    }, [params, currentPrice]);

    // Get cell color based on intrinsic value compared to current price
    const getCellColor = (cell) => {
        if (!cell.value) return 'bg-slate-800/50';

        const diff = cell.percentDiff;

        if (diff > 30) return 'bg-profit/40';
        if (diff > 15) return 'bg-profit/25';
        if (diff > 5) return 'bg-profit/15';
        if (diff > -5) return 'bg-slate-700/50';
        if (diff > -15) return 'bg-loss/15';
        if (diff > -30) return 'bg-loss/25';
        return 'bg-loss/40';
    };

    // Get text color based on value
    const getTextColor = (cell) => {
        if (!cell.value) return 'text-slate-500';
        if (cell.percentDiff > 10) return 'text-profit';
        if (cell.percentDiff < -10) return 'text-loss';
        return 'text-white';
    };

    return (
        <Card glass className="mt-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indus-500/10 rounded-md flex items-center justify-center">
                    <Grid3X3 className="text-indus-500" size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Sensitivity Analysis</h2>
                    <p className="text-xs text-slate-400">WACC vs Terminal Growth Rate impact on valuation</p>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-profit/30"></div>
                    <span className="text-slate-400">Higher Valuation</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-loss/30"></div>
                    <span className="text-slate-400">Lower Valuation</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <Info size={12} className="text-slate-500" />
                    <span className="text-slate-500">Hover for details</span>
                </div>
            </div>

            {/* Matrix */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 text-xs text-slate-500 font-medium text-right">
                                WACC \ TGR
                            </th>
                            {variations.map((v, idx) => (
                                <th key={idx} className="p-2 text-xs text-slate-400 font-mono text-center min-w-[70px]">
                                    {params.terminalGrowth + v}%
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                <td className="p-2 text-xs text-slate-400 font-mono text-right">
                                    {(params.wacc + variations[rowIdx]).toFixed(1)}%
                                </td>
                                {row.map((cell, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className="p-1"
                                        onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                                        onMouseLeave={() => setHoveredCell(null)}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className={`
                                                relative p-3 rounded-md text-center cursor-pointer
                                                transition-all duration-200
                                                ${getCellColor(cell)}
                                                ${cell.isCenter ? 'ring-2 ring-indus-500' : 'border border-slate-700/50'}
                                            `}
                                        >
                                            <span className={`font-mono text-sm font-semibold ${getTextColor(cell)}`}>
                                                {cell.value ? `$${cell.value.toFixed(0)}` : 'N/A'}
                                            </span>

                                            {/* Hover Tooltip */}
                                            {hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx && cell.value && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-800 border border-slate-700 rounded-md shadow-xl whitespace-nowrap"
                                                >
                                                    <p className="text-xs text-slate-300 mb-1">
                                                        WACC: {cell.wacc.toFixed(1)}% | TGR: {cell.tg.toFixed(1)}%
                                                    </p>
                                                    <p className={`text-sm font-semibold ${cell.percentDiff >= 0 ? 'text-profit' : 'text-loss'}`}>
                                                        {cell.percentDiff >= 0 ? '+' : ''}{cell.percentDiff.toFixed(1)}% vs Current Price
                                                    </p>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Insight */}
            <div className="mt-4 p-3 bg-slate-800/50 rounded-md border border-slate-700">
                <p className="text-xs text-slate-400">
                    <span className="text-indus-400 font-medium">Key Insight:</span> The highlighted cell shows current parameters.
                    Moving right (higher terminal growth) or up (lower WACC) increases valuation.
                </p>
            </div>
        </Card>
    );
}
