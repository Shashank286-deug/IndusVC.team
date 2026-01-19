import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitCompare,
    Plus,
    X,
    ChevronDown,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Check,
    Minus
} from 'lucide-react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    LineChart, Line
} from 'recharts';

// Industry data export for use in comparison
export const industries = {
    technology: {
        id: 'technology',
        name: 'Technology',
        color: '#3b82f6',
        marketCap: '12.5T',
        avgPE: 28.5,
        growthRate: 15.2,
        volatility: 'High',
        outlook: 'Bullish',
        dividendYield: 0.8,
        debtToEquity: 0.42,
        metrics: {
            growth: 85,
            stability: 60,
            profitability: 78,
            innovation: 95,
            competition: 70
        },
        historicalGrowth: [
            { year: '2020', growth: 22 },
            { year: '2021', growth: 35 },
            { year: '2022', growth: -18 },
            { year: '2023', growth: 45 },
            { year: '2024', growth: 28 }
        ]
    },
    healthcare: {
        id: 'healthcare',
        name: 'Healthcare',
        color: '#ef4444',
        marketCap: '7.2T',
        avgPE: 22.3,
        growthRate: 8.5,
        volatility: 'Medium',
        dividendYield: 1.5,
        debtToEquity: 0.65,
        outlook: 'Neutral',
        metrics: {
            growth: 65,
            stability: 85,
            profitability: 72,
            innovation: 80,
            competition: 60
        },
        historicalGrowth: [
            { year: '2020', growth: 15 },
            { year: '2021', growth: 22 },
            { year: '2022', growth: -5 },
            { year: '2023', growth: 8 },
            { year: '2024', growth: 12 }
        ]
    },
    finance: {
        id: 'finance',
        name: 'Financial Services',
        color: '#10b981',
        marketCap: '8.8T',
        avgPE: 12.5,
        growthRate: 6.2,
        volatility: 'Medium',
        dividendYield: 2.8,
        debtToEquity: 1.2,
        outlook: 'Neutral',
        metrics: {
            growth: 55,
            stability: 70,
            profitability: 82,
            innovation: 60,
            competition: 75
        },
        historicalGrowth: [
            { year: '2020', growth: -8 },
            { year: '2021', growth: 35 },
            { year: '2022', growth: -12 },
            { year: '2023', growth: 18 },
            { year: '2024', growth: 10 }
        ]
    },
    energy: {
        id: 'energy',
        name: 'Energy',
        color: '#f59e0b',
        marketCap: '4.5T',
        avgPE: 10.2,
        growthRate: 4.8,
        volatility: 'High',
        dividendYield: 3.5,
        debtToEquity: 0.55,
        outlook: 'Neutral',
        metrics: {
            growth: 45,
            stability: 50,
            profitability: 68,
            innovation: 55,
            competition: 65
        },
        historicalGrowth: [
            { year: '2020', growth: -35 },
            { year: '2021', growth: 48 },
            { year: '2022', growth: 55 },
            { year: '2023', growth: -8 },
            { year: '2024', growth: 5 }
        ]
    },
    consumer: {
        id: 'consumer',
        name: 'Consumer Goods',
        color: '#8b5cf6',
        marketCap: '5.2T',
        avgPE: 18.5,
        growthRate: 5.5,
        volatility: 'Low',
        dividendYield: 2.2,
        debtToEquity: 0.48,
        outlook: 'Neutral',
        metrics: {
            growth: 50,
            stability: 80,
            profitability: 65,
            innovation: 50,
            competition: 80
        },
        historicalGrowth: [
            { year: '2020', growth: 8 },
            { year: '2021', growth: 18 },
            { year: '2022', growth: -5 },
            { year: '2023', growth: 12 },
            { year: '2024', growth: 8 }
        ]
    },
    manufacturing: {
        id: 'manufacturing',
        name: 'Manufacturing',
        color: '#64748b',
        marketCap: '3.8T',
        avgPE: 16.2,
        growthRate: 4.2,
        volatility: 'Medium',
        dividendYield: 1.8,
        debtToEquity: 0.72,
        outlook: 'Neutral',
        metrics: {
            growth: 45,
            stability: 70,
            profitability: 58,
            innovation: 65,
            competition: 70
        },
        historicalGrowth: [
            { year: '2020', growth: -12 },
            { year: '2021', growth: 25 },
            { year: '2022', growth: 8 },
            { year: '2023', growth: 5 },
            { year: '2024', growth: 6 }
        ]
    }
};

// Industry Selector for Comparison
function IndustryMultiSelect({ selectedIds, onChange, maxSelections = 4 }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleIndustry = (id) => {
        if (selectedIds.includes(id)) {
            if (selectedIds.length > 1) {
                onChange(selectedIds.filter(i => i !== id));
            }
        } else if (selectedIds.length < maxSelections) {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 hover:border-indus-500/50 transition-colors"
            >
                <Plus size={16} className="text-indus-400" />
                <span className="text-white text-sm">Add Industry</span>
                <span className="text-xs text-slate-400">({selectedIds.length}/{maxSelections})</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-50 min-w-[220px] shadow-xl"
                        >
                            <div className="p-2">
                                <p className="text-xs text-slate-400 px-2 py-1 mb-1">Select up to {maxSelections} industries</p>
                                {Object.entries(industries).map(([key, industry]) => {
                                    const isSelected = selectedIds.includes(key);
                                    const isDisabled = !isSelected && selectedIds.length >= maxSelections;

                                    return (
                                        <button
                                            key={key}
                                            onClick={() => !isDisabled && toggleIndustry(key)}
                                            disabled={isDisabled}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${isSelected
                                                    ? 'bg-slate-700'
                                                    : isDisabled
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : 'hover:bg-slate-700/50'
                                                }`}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: industry.color }}
                                            />
                                            <span className="text-sm text-white flex-1">{industry.name}</span>
                                            {isSelected && (
                                                <Check size={14} className="text-profit" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Selected Industry Pills
function SelectedIndustryPills({ selectedIds, onRemove }) {
    return (
        <div className="flex flex-wrap gap-2">
            {selectedIds.map(id => {
                const industry = industries[id];
                return (
                    <motion.div
                        key={id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: `${industry.color}20`, border: `1px solid ${industry.color}40` }}
                    >
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: industry.color }}
                        />
                        <span style={{ color: industry.color }} className="text-sm font-medium">
                            {industry.name}
                        </span>
                        {selectedIds.length > 1 && (
                            <button
                                onClick={() => onRemove(id)}
                                className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={12} style={{ color: industry.color }} />
                            </button>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

// Comparison Radar Chart
function ComparisonRadarChart({ selectedIds }) {
    const radarData = useMemo(() => {
        const metrics = ['Growth', 'Stability', 'Profitability', 'Innovation', 'Competition'];
        return metrics.map(metric => {
            const dataPoint = { subject: metric };
            selectedIds.forEach(id => {
                const industry = industries[id];
                dataPoint[id] = industry.metrics[metric.toLowerCase()];
            });
            return dataPoint;
        });
    }, [selectedIds]);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-indus-400" />
                Metrics Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                    {selectedIds.map((id, index) => (
                        <Radar
                            key={id}
                            name={industries[id].name}
                            dataKey={id}
                            stroke={industries[id].color}
                            fill={industries[id].color}
                            fillOpacity={0.15}
                            strokeWidth={2}
                        />
                    ))}
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => <span className="text-slate-300 text-sm">{industries[value]?.name || value}</span>}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}

// Historical Growth Comparison Chart
function GrowthComparisonChart({ selectedIds }) {
    const chartData = useMemo(() => {
        const years = ['2020', '2021', '2022', '2023', '2024'];
        return years.map(year => {
            const dataPoint = { year };
            selectedIds.forEach(id => {
                const industry = industries[id];
                const yearData = industry.historicalGrowth.find(h => h.year === year);
                dataPoint[id] = yearData?.growth || 0;
            });
            return dataPoint;
        });
    }, [selectedIds]);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-indus-400" />
                Historical Growth Comparison (YoY %)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
                    <YAxis tick={{ fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#fff' }}
                        formatter={(value, name) => [`${value}%`, industries[name]?.name || name]}
                    />
                    <Legend
                        formatter={(value) => <span className="text-slate-300 text-sm">{industries[value]?.name || value}</span>}
                    />
                    {selectedIds.map((id) => (
                        <Line
                            key={id}
                            type="monotone"
                            dataKey={id}
                            stroke={industries[id].color}
                            strokeWidth={2}
                            dot={{ fill: industries[id].color, strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: industries[id].color }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// Key Metrics Bar Comparison
function MetricsBarComparison({ selectedIds }) {
    const metrics = [
        { key: 'avgPE', label: 'P/E Ratio', format: (v) => `${v}x` },
        { key: 'growthRate', label: 'Growth Rate', format: (v) => `${v}%` },
        { key: 'dividendYield', label: 'Dividend Yield', format: (v) => `${v}%` },
        { key: 'debtToEquity', label: 'Debt/Equity', format: (v) => v.toFixed(2) }
    ];

    const chartData = useMemo(() => {
        return metrics.map(metric => {
            const dataPoint = { metric: metric.label };
            selectedIds.forEach(id => {
                dataPoint[id] = industries[id][metric.key];
            });
            return dataPoint;
        });
    }, [selectedIds]);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Key Financial Metrics</h3>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" tick={{ fill: '#94a3b8' }} />
                    <YAxis type="category" dataKey="metric" tick={{ fill: '#94a3b8' }} width={100} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#fff' }}
                        formatter={(value, name) => [value, industries[name]?.name || name]}
                    />
                    <Legend
                        formatter={(value) => <span className="text-slate-300 text-sm">{industries[value]?.name || value}</span>}
                    />
                    {selectedIds.map((id) => (
                        <Bar
                            key={id}
                            dataKey={id}
                            fill={industries[id].color}
                            radius={[0, 4, 4, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// Comparison Table
function ComparisonTable({ selectedIds }) {
    const compareMetrics = [
        { key: 'marketCap', label: 'Market Cap', prefix: '$' },
        { key: 'avgPE', label: 'P/E Ratio', suffix: 'x' },
        { key: 'growthRate', label: 'Growth Rate', suffix: '%', highlight: true },
        { key: 'volatility', label: 'Volatility' },
        { key: 'outlook', label: 'Outlook' },
        { key: 'dividendYield', label: 'Dividend Yield', suffix: '%' },
        { key: 'debtToEquity', label: 'Debt/Equity' }
    ];

    const getHighlight = (metric, value, allValues) => {
        if (!metric.highlight) return '';
        const numericValues = allValues.filter(v => typeof v === 'number');
        if (numericValues.length === 0) return '';

        const max = Math.max(...numericValues);
        const min = Math.min(...numericValues);

        if (value === max) return 'text-profit';
        if (value === min) return 'text-loss';
        return '';
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <GitCompare size={20} className="text-indus-400" />
                Detailed Comparison
            </h3>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-800">
                        <th className="text-left text-sm text-slate-400 font-medium py-3 px-3">Metric</th>
                        {selectedIds.map(id => (
                            <th key={id} className="text-center text-sm font-medium py-3 px-3">
                                <div className="flex items-center justify-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: industries[id].color }}
                                    />
                                    <span style={{ color: industries[id].color }}>
                                        {industries[id].name}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {compareMetrics.map((metric, i) => {
                        const allValues = selectedIds.map(id => industries[id][metric.key]);

                        return (
                            <motion.tr
                                key={metric.key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                            >
                                <td className="py-3 px-3 text-slate-300">{metric.label}</td>
                                {selectedIds.map(id => {
                                    const value = industries[id][metric.key];
                                    const displayValue = `${metric.prefix || ''}${value}${metric.suffix || ''}`;
                                    const highlightClass = getHighlight(metric, value, allValues);

                                    return (
                                        <td
                                            key={id}
                                            className={`py-3 px-3 text-center font-mono ${highlightClass || 'text-white'}`}
                                        >
                                            {displayValue}
                                        </td>
                                    );
                                })}
                            </motion.tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// Main Comparison Component
export default function IndustryComparison() {
    const [selectedIndustries, setSelectedIndustries] = useState(['technology', 'healthcare']);

    const handleRemoveIndustry = (id) => {
        if (selectedIndustries.length > 1) {
            setSelectedIndustries(selectedIndustries.filter(i => i !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                            <GitCompare className="text-indus-500" size={24} />
                            Industry Comparison
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Compare key metrics and performance across different industries
                        </p>
                    </div>
                    <IndustryMultiSelect
                        selectedIds={selectedIndustries}
                        onChange={setSelectedIndustries}
                        maxSelections={4}
                    />
                </div>

                {/* Selected Industries */}
                <div className="mt-4">
                    <AnimatePresence mode="popLayout">
                        <SelectedIndustryPills
                            selectedIds={selectedIndustries}
                            onRemove={handleRemoveIndustry}
                        />
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Comparison Charts */}
            {selectedIndustries.length >= 2 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    <ComparisonRadarChart selectedIds={selectedIndustries} />
                    <GrowthComparisonChart selectedIds={selectedIndustries} />
                </motion.div>
            )}

            {/* Metrics Bar Chart */}
            {selectedIndustries.length >= 2 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <MetricsBarComparison selectedIds={selectedIndustries} />
                </motion.div>
            )}

            {/* Comparison Table */}
            {selectedIndustries.length >= 2 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <ComparisonTable selectedIds={selectedIndustries} />
                </motion.div>
            )}

            {/* Not enough industries selected */}
            {selectedIndustries.length < 2 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-900/50 border border-dashed border-slate-700 rounded-xl p-12 text-center"
                >
                    <GitCompare size={48} className="text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">
                        Select at least 2 industries to compare
                    </h3>
                    <p className="text-slate-500 text-sm">
                        Use the "Add Industry" button above to select industries for comparison
                    </p>
                </motion.div>
            )}
        </div>
    );
}
