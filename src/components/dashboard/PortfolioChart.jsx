import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { portfolioPerformance } from '../../lib/mockData';
import Card from '../ui/Card';
import { useUserPreferences, BENCHMARK_DATA } from '../../context/UserPreferencesContext';

export default function PortfolioChart() {
    const { benchmarkIndex, currencySymbol } = useUserPreferences();
    const benchmarkConfig = BENCHMARK_DATA[benchmarkIndex] || BENCHMARK_DATA['NIFTY 50'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 rounded-md p-3 shadow-xl">
                    <p className="text-slate-300 text-sm font-medium mb-2">{payload[0].payload.date}</p>
                    <div className="space-y-1">
                        <p className="text-indus-400 text-sm font-mono">
                            Portfolio: {currencySymbol}{(payload[0].value / 1000).toFixed(0)}K
                        </p>
                        <p className="text-slate-400 text-sm font-mono">
                            {benchmarkIndex}: {currencySymbol}{(payload[1].value / 1000).toFixed(0)}K
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Portfolio Performance</h2>
                <p className="text-slate-400 text-sm">vs {benchmarkIndex} Benchmark</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={portfolioPerformance}>
                    <defs>
                        <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        style={{ fontSize: '12px', fill: '#94a3b8' }}
                    />
                    <YAxis
                        stroke="#64748b"
                        style={{ fontSize: '12px', fill: '#94a3b8' }}
                        tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: '14px', paddingTop: '16px' }}
                        iconType="line"
                    />
                    <Area
                        type="monotone"
                        dataKey="portfolio"
                        stroke="#f97316"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPortfolio)"
                        name="Your Portfolio"
                    />
                    <Area
                        type="monotone"
                        dataKey="sp500"
                        stroke="#64748b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorBenchmark)"
                        name={benchmarkIndex}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}

