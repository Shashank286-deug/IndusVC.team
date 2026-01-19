import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { correlationMatrix } from '../../lib/mockData';
import { AlertTriangle, Grid3X3 } from 'lucide-react';

export default function CorrelationMatrix() {
    const { symbols, names, data } = correlationMatrix;

    // Calculate average correlation (excluding diagonal)
    const avgCorrelation = useMemo(() => {
        let sum = 0;
        let count = 0;

        for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data[i].length; j++) {
                sum += data[i][j];
                count++;
            }
        }

        return count > 0 ? sum / count : 0;
    }, [data]);

    const showWarning = avgCorrelation > 0.6;

    // Get cell color based on correlation value
    const getCellColor = (value, isDiagonal) => {
        if (isDiagonal) return 'bg-slate-800';
        if (value > 0.7) return 'bg-loss/40';       // High correlation = Risk (Red)
        if (value > 0.5) return 'bg-yellow-500/30'; // Medium correlation (Yellow)
        if (value > 0.3) return 'bg-yellow-500/15'; // Low-medium
        return 'bg-profit/25';                      // Good diversification (Green)
    };

    // Get text color based on correlation value
    const getTextColor = (value, isDiagonal) => {
        if (isDiagonal) return 'text-slate-500';
        if (value > 0.7) return 'text-loss';
        if (value > 0.5) return 'text-yellow-400';
        if (value > 0.3) return 'text-yellow-300';
        return 'text-profit';
    };

    return (
        <Card className="mt-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indus-500/10 rounded-md flex items-center justify-center">
                    <Grid3X3 className="text-indus-500" size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Holdings Correlation</h2>
                    <p className="text-xs text-slate-400">Correlation between top 5 portfolio holdings</p>
                </div>
            </div>

            {/* Warning Banner */}
            {showWarning && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-loss/10 border border-loss/30 rounded-md flex items-start gap-3"
                >
                    <AlertTriangle className="text-loss flex-shrink-0 mt-0.5" size={18} />
                    <div>
                        <p className="text-sm font-medium text-loss">High Portfolio Correlation Detected</p>
                        <p className="text-xs text-red-300/80 mt-0.5">
                            Average correlation is {avgCorrelation.toFixed(2)}. Portfolio assets are highly correlated;
                            diversification effectiveness is low.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-loss/40"></div>
                    <span className="text-slate-400">&gt;0.7 High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500/30"></div>
                    <span className="text-slate-400">0.3-0.7 Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-profit/25"></div>
                    <span className="text-slate-400">&lt;0.3 Good</span>
                </div>
            </div>

            {/* Correlation Matrix Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 text-xs text-slate-500 font-medium"></th>
                            {symbols.map((symbol, idx) => (
                                <th key={idx} className="p-2 text-xs text-slate-400 font-mono text-center min-w-[60px]">
                                    {symbol}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                <td className="p-2 text-xs text-slate-400 font-mono text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="font-semibold">{symbols[rowIdx]}</span>
                                        <span className="text-slate-500 text-[10px]">{names[rowIdx]}</span>
                                    </div>
                                </td>
                                {row.map((value, colIdx) => {
                                    const isDiagonal = rowIdx === colIdx;
                                    // Only show upper triangle (including diagonal)
                                    const showValue = colIdx >= rowIdx;

                                    return (
                                        <td key={colIdx} className="p-1">
                                            {showValue ? (
                                                <motion.div
                                                    whileHover={{ scale: isDiagonal ? 1 : 1.05 }}
                                                    className={`
                                                        p-2 rounded-md text-center
                                                        ${getCellColor(value, isDiagonal)}
                                                        ${isDiagonal ? '' : 'border border-slate-700/50'}
                                                    `}
                                                >
                                                    <span className={`font-mono text-sm font-semibold ${getTextColor(value, isDiagonal)}`}>
                                                        {isDiagonal ? '—' : value.toFixed(2)}
                                                    </span>
                                                </motion.div>
                                            ) : (
                                                <div className="p-2 rounded-md text-center bg-transparent">
                                                    <span className="font-mono text-sm text-slate-700">—</span>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Average Correlation Metric */}
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-400">Average Portfolio Correlation</p>
                    <p className={`text-xl font-mono font-bold ${avgCorrelation > 0.6 ? 'text-loss' : avgCorrelation > 0.4 ? 'text-yellow-400' : 'text-profit'}`}>
                        {avgCorrelation.toFixed(2)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Diversification Score</p>
                    <p className={`text-xl font-mono font-bold ${avgCorrelation > 0.6 ? 'text-loss' : avgCorrelation > 0.4 ? 'text-yellow-400' : 'text-profit'}`}>
                        {avgCorrelation > 0.6 ? 'Poor' : avgCorrelation > 0.4 ? 'Moderate' : 'Good'}
                    </p>
                </div>
            </div>
        </Card>
    );
}
