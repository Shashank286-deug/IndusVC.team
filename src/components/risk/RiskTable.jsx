import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { holdings } from '../../lib/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function RiskTable() {
    const getRiskVariant = (risk) => {
        const riskMap = {
            'Low': 'low',
            'Medium': 'medium',
            'High': 'high',
        };
        return riskMap[risk] || 'default';
    };

    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-6">Holdings Overview</h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-slate-400">Symbol</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-slate-400">Name</th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-slate-400">Sector</th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-slate-400">Allocation</th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-slate-400">Value</th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-slate-400">Return</th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-slate-400">Risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.map((holding) => (
                            <tr
                                key={holding.symbol}
                                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                            >
                                <td className="py-3 px-2">
                                    <span className="text-white font-mono font-bold">{holding.symbol}</span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className="text-slate-300 text-sm">{holding.name}</span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className="text-slate-400 text-sm">{holding.sector}</span>
                                </td>
                                <td className="py-3 px-2 text-right">
                                    <span className="text-white font-mono">{holding.allocation}%</span>
                                </td>
                                <td className="py-3 px-2 text-right">
                                    <span className="text-slate-300 font-mono text-sm">
                                        ${(holding.value / 1000).toFixed(1)}K
                                    </span>
                                </td>
                                <td className="py-3 px-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {holding.return >= 0 ? (
                                            <TrendingUp className="text-profit" size={14} />
                                        ) : (
                                            <TrendingDown className="text-loss" size={14} />
                                        )}
                                        <span className={`font-mono text-sm font-semibold ${holding.return >= 0 ? 'text-profit' : 'text-loss'}`}>
                                            {holding.return >= 0 ? '+' : ''}{holding.return}%
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <Badge variant={getRiskVariant(holding.risk)}>
                                        {holding.risk}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {holdings.map((holding) => (
                    <div
                        key={holding.symbol}
                        className="bg-slate-800/30 rounded-md p-4 border border-slate-800"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-white font-mono font-bold text-lg">{holding.symbol}</div>
                                <div className="text-slate-400 text-sm">{holding.name}</div>
                            </div>
                            <Badge variant={getRiskVariant(holding.risk)}>
                                {holding.risk}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <div className="text-slate-500 text-xs">Sector</div>
                                <div className="text-slate-300">{holding.sector}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs">Allocation</div>
                                <div className="text-white font-mono">{holding.allocation}%</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs">Value</div>
                                <div className="text-slate-300 font-mono">${(holding.value / 1000).toFixed(1)}K</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs">Return</div>
                                <div className={`font-mono font-semibold ${holding.return >= 0 ? 'text-profit' : 'text-loss'}`}>
                                    {holding.return >= 0 ? '+' : ''}{holding.return}%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
