import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { getValuationStatus } from '../../lib/dcfCalculator';

export default function ValuationChart({ intrinsicValue, currentPrice }) {
    const valuation = getValuationStatus(intrinsicValue, currentPrice);
    const difference = intrinsicValue - currentPrice;
    const percentDifference = ((difference / currentPrice) * 100).toFixed(1);

    const data = [
        { name: 'Current Price', value: currentPrice, type: 'current' },
        { name: 'Intrinsic Value', value: intrinsicValue, type: 'intrinsic' },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 rounded-md p-3 shadow-xl">
                    <p className="text-slate-300 text-sm font-medium mb-1">{payload[0].payload.name}</p>
                    <p className="text-white text-lg font-mono font-bold">
                        ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card glass>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-3">Valuation Result</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-800/50 rounded-md p-4">
                        <p className="text-xs text-slate-400 mb-1">Current Market Price</p>
                        <p className="text-2xl font-mono font-bold text-white">${currentPrice.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-md p-4">
                        <p className="text-xs text-slate-400 mb-1">Intrinsic Value</p>
                        <p className="text-2xl font-mono font-bold text-indus-400">${intrinsicValue.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-800/50 rounded-md p-4">
                    <Badge variant={valuation.status === 'undervalued' ? 'profit' : valuation.status === 'overvalued' ? 'loss' : 'default'}>
                        {valuation.label}
                    </Badge>
                    <div>
                        <p className={`text-sm font-semibold ${difference >= 0 ? 'text-profit' : 'text-loss'}`}>
                            {difference >= 0 ? '+' : ''}${difference.toFixed(2)} ({difference >= 0 ? '+' : ''}{percentDifference}%)
                        </p>
                        <p className="text-xs text-slate-400">
                            {difference >= 0 ? 'Potential upside' : 'Potential downside'}
                        </p>
                    </div>
                </div>
            </div>

            <motion.div
                key={intrinsicValue}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            style={{ fontSize: '12px', fill: '#94a3b8' }}
                        />
                        <YAxis
                            stroke="#64748b"
                            style={{ fontSize: '12px', fill: '#94a3b8' }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={currentPrice} stroke="#64748b" strokeDasharray="3 3" />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.type === 'intrinsic' ? '#f97316' : '#475569'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </Card>
    );
}
