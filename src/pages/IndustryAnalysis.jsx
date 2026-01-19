import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    BarChart3,
    Users,
    DollarSign,
    Target,
    Zap,
    Shield,
    Globe,
    Cpu,
    Heart,
    ShoppingCart,
    Fuel,
    Factory,
    Landmark,
    Smartphone,
    GitCompare
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    LineChart, Line
} from 'recharts';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import IndustryComparison from '../components/dashboard/IndustryComparison';


// Industry Data
const industries = {
    technology: {
        name: 'Technology',
        icon: Cpu,
        color: '#3b82f6',
        overview: 'The technology sector continues to drive innovation across all industries, with AI, cloud computing, and cybersecurity leading growth.',
        marketCap: '12.5T',
        avgPE: 28.5,
        growthRate: 15.2,
        volatility: 'High',
        outlook: 'Bullish',
        metrics: {
            growth: 85,
            stability: 60,
            profitability: 78,
            innovation: 95,
            competition: 70
        },
        keyDrivers: ['AI & Machine Learning', 'Cloud Computing', 'Cybersecurity', '5G Adoption'],
        risks: ['Regulatory scrutiny', 'High valuations', 'Talent shortage'],
        topCompanies: [
            { name: 'Apple', ticker: 'AAPL', pe: 28.5, growth: 12.3 },
            { name: 'Microsoft', ticker: 'MSFT', pe: 32.1, growth: 18.7 },
            { name: 'Google', ticker: 'GOOGL', pe: 24.8, growth: 15.2 },
            { name: 'NVIDIA', ticker: 'NVDA', pe: 65.2, growth: 45.8 }
        ],
        historicalGrowth: [
            { year: '2020', growth: 22 },
            { year: '2021', growth: 35 },
            { year: '2022', growth: -18 },
            { year: '2023', growth: 45 },
            { year: '2024', growth: 28 }
        ]
    },
    healthcare: {
        name: 'Healthcare',
        icon: Heart,
        color: '#ef4444',
        overview: 'Healthcare sector shows resilience with aging demographics and biotech innovations driving long-term growth potential.',
        marketCap: '7.2T',
        avgPE: 22.3,
        growthRate: 8.5,
        volatility: 'Medium',
        outlook: 'Neutral',
        metrics: {
            growth: 65,
            stability: 85,
            profitability: 72,
            innovation: 80,
            competition: 60
        },
        keyDrivers: ['Aging Population', 'Biotech Innovation', 'Telehealth', 'Personalized Medicine'],
        risks: ['Regulatory changes', 'Drug pricing pressure', 'Patent cliffs'],
        topCompanies: [
            { name: 'UnitedHealth', ticker: 'UNH', pe: 21.5, growth: 12.1 },
            { name: 'Johnson & Johnson', ticker: 'JNJ', pe: 15.8, growth: 5.3 },
            { name: 'Pfizer', ticker: 'PFE', pe: 12.4, growth: -8.2 },
            { name: 'Eli Lilly', ticker: 'LLY', pe: 58.3, growth: 35.2 }
        ],
        historicalGrowth: [
            { year: '2020', growth: 15 },
            { year: '2021', growth: 22 },
            { year: '2022', growth: -5 },
            { year: '2023', growth: 8 },
            { year: '2024', growth: 12 }
        ]
    },
    finance: {
        name: 'Financial Services',
        icon: Landmark,
        color: '#10b981',
        overview: 'Financial sector benefits from rising interest rates while facing fintech disruption and digital transformation challenges.',
        marketCap: '8.8T',
        avgPE: 12.5,
        growthRate: 6.2,
        volatility: 'Medium',
        outlook: 'Neutral',
        metrics: {
            growth: 55,
            stability: 70,
            profitability: 82,
            innovation: 60,
            competition: 75
        },
        keyDrivers: ['Interest Rate Environment', 'Digital Banking', 'Wealth Management', 'Regulatory Tech'],
        risks: ['Credit risk', 'Fintech competition', 'Economic downturn'],
        topCompanies: [
            { name: 'JPMorgan', ticker: 'JPM', pe: 11.2, growth: 8.5 },
            { name: 'Bank of America', ticker: 'BAC', pe: 10.8, growth: 5.2 },
            { name: 'Visa', ticker: 'V', pe: 28.5, growth: 12.3 },
            { name: 'Goldman Sachs', ticker: 'GS', pe: 14.2, growth: 15.8 }
        ],
        historicalGrowth: [
            { year: '2020', growth: -8 },
            { year: '2021', growth: 35 },
            { year: '2022', growth: -12 },
            { year: '2023', growth: 18 },
            { year: '2024', growth: 10 }
        ]
    },
    energy: {
        name: 'Energy',
        icon: Fuel,
        color: '#f59e0b',
        overview: 'Energy sector in transition with traditional oil & gas balancing against renewable energy growth and ESG pressures.',
        marketCap: '4.5T',
        avgPE: 10.2,
        growthRate: 4.8,
        volatility: 'High',
        outlook: 'Neutral',
        metrics: {
            growth: 45,
            stability: 50,
            profitability: 68,
            innovation: 55,
            competition: 65
        },
        keyDrivers: ['Oil Prices', 'Renewable Transition', 'EV Adoption', 'Energy Security'],
        risks: ['Price volatility', 'ESG pressures', 'Regulatory changes'],
        topCompanies: [
            { name: 'ExxonMobil', ticker: 'XOM', pe: 12.5, growth: 5.2 },
            { name: 'Chevron', ticker: 'CVX', pe: 11.8, growth: 4.8 },
            { name: 'NextEra Energy', ticker: 'NEE', pe: 22.5, growth: 12.3 },
            { name: 'Enphase', ticker: 'ENPH', pe: 35.2, growth: 28.5 }
        ],
        historicalGrowth: [
            { year: '2020', growth: -35 },
            { year: '2021', growth: 48 },
            { year: '2022', growth: 55 },
            { year: '2023', growth: -8 },
            { year: '2024', growth: 5 }
        ]
    },
    consumer: {
        name: 'Consumer Goods',
        icon: ShoppingCart,
        color: '#8b5cf6',
        overview: 'Consumer sector faces inflation pressures but benefits from strong employment and resilient consumer spending.',
        marketCap: '5.2T',
        avgPE: 18.5,
        growthRate: 5.5,
        volatility: 'Low',
        outlook: 'Neutral',
        metrics: {
            growth: 50,
            stability: 80,
            profitability: 65,
            innovation: 50,
            competition: 80
        },
        keyDrivers: ['Consumer Spending', 'E-commerce Growth', 'Brand Loyalty', 'Emerging Markets'],
        risks: ['Inflation impact', 'Supply chain', 'Changing preferences'],
        topCompanies: [
            { name: 'Procter & Gamble', ticker: 'PG', pe: 24.5, growth: 4.2 },
            { name: 'Coca-Cola', ticker: 'KO', pe: 22.8, growth: 5.8 },
            { name: 'Nike', ticker: 'NKE', pe: 28.5, growth: 8.5 },
            { name: 'Amazon', ticker: 'AMZN', pe: 45.2, growth: 22.3 }
        ],
        historicalGrowth: [
            { year: '2020', growth: 8 },
            { year: '2021', growth: 18 },
            { year: '2022', growth: -5 },
            { year: '2023', growth: 12 },
            { year: '2024', growth: 8 }
        ]
    },
    manufacturing: {
        name: 'Manufacturing',
        icon: Factory,
        color: '#64748b',
        overview: 'Manufacturing sector adapts to automation and reshoring trends while managing supply chain complexities.',
        marketCap: '3.8T',
        avgPE: 16.2,
        growthRate: 4.2,
        volatility: 'Medium',
        outlook: 'Neutral',
        metrics: {
            growth: 45,
            stability: 70,
            profitability: 58,
            innovation: 65,
            competition: 70
        },
        keyDrivers: ['Automation', 'Reshoring', 'Industry 4.0', 'Supply Chain'],
        risks: ['Labor costs', 'Trade policies', 'Raw material prices'],
        topCompanies: [
            { name: 'Caterpillar', ticker: 'CAT', pe: 15.8, growth: 8.2 },
            { name: '3M', ticker: 'MMM', pe: 12.5, growth: -2.5 },
            { name: 'Honeywell', ticker: 'HON', pe: 22.3, growth: 6.8 },
            { name: 'Deere & Co', ticker: 'DE', pe: 14.2, growth: 12.5 }
        ],
        historicalGrowth: [
            { year: '2020', growth: -12 },
            { year: '2021', growth: 25 },
            { year: '2022', growth: 8 },
            { year: '2023', growth: 5 },
            { year: '2024', growth: 6 }
        ]
    }
};

// Components
function MetricBar({ label, value, color }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-slate-400">{label}</span>
                <span className="text-white font-mono">{value}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
}

function IndustrySelector({ selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedIndustry = industries[selected];
    const Icon = selectedIndustry.icon;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 hover:border-indus-500/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${selectedIndustry.color}20` }}
                    >
                        <Icon style={{ color: selectedIndustry.color }} size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-white font-semibold">{selectedIndustry.name}</p>
                        <p className="text-xs text-slate-400">Click to change industry</p>
                    </div>
                </div>
                <ChevronDown className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-50"
                    >
                        {Object.entries(industries).map(([key, industry]) => {
                            const ItemIcon = industry.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => { onChange(key); setIsOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors ${selected === key ? 'bg-slate-700' : ''}`}
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${industry.color}20` }}
                                    >
                                        <ItemIcon style={{ color: industry.color }} size={16} />
                                    </div>
                                    <span className="text-white">{industry.name}</span>
                                    {selected === key && <CheckCircle className="ml-auto text-profit" size={16} />}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function IndustryAnalysis() {
    const [selectedIndustry, setSelectedIndustry] = useState('technology');
    const [viewMode, setViewMode] = useState('analysis'); // 'analysis' or 'compare'
    const industry = industries[selectedIndustry];
    const Icon = industry.icon;

    const radarData = [
        { subject: 'Growth', value: industry.metrics.growth },
        { subject: 'Stability', value: industry.metrics.stability },
        { subject: 'Profitability', value: industry.metrics.profitability },
        { subject: 'Innovation', value: industry.metrics.innovation },
        { subject: 'Competition', value: industry.metrics.competition }
    ];

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />

            <div className="p-8 relative z-10">
                {/* Header */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="text-indus-500" size={32} />
                        <h1 className="text-3xl font-bold text-white">
                            Industry <span className="gradient-text">Analysis</span>
                        </h1>
                    </div>
                    <p className="text-slate-400">
                        Deep dive into sector trends, metrics, and investment insights
                    </p>
                </motion.div>

                {/* View Mode Tabs */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex bg-slate-800/50 border border-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('analysis')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'analysis'
                                ? 'bg-indus-500 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            <BarChart3 size={16} />
                            Analysis
                        </button>
                        <button
                            onClick={() => setViewMode('compare')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'compare'
                                ? 'bg-indus-500 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            <GitCompare size={16} />
                            Compare
                        </button>
                    </div>
                </div>

                {/* Compare View */}
                {viewMode === 'compare' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IndustryComparison />
                    </motion.div>
                ) : (
                    <>
                        {/* Industry Selector - Only show in Analysis mode */}
                        <div className="mb-8 max-w-md">
                            <IndustrySelector selected={selectedIndustry} onChange={setSelectedIndustry} />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedIndustry}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Overview Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <motion.div
                                        className="bg-slate-900 border border-slate-800 rounded-xl p-4"
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                            <DollarSign size={16} />
                                            <span>Market Cap</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white font-mono">${industry.marketCap}</p>
                                    </motion.div>

                                    <motion.div
                                        className="bg-slate-900 border border-slate-800 rounded-xl p-4"
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                            <BarChart3 size={16} />
                                            <span>Avg P/E Ratio</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white font-mono">{industry.avgPE}x</p>
                                    </motion.div>

                                    <motion.div
                                        className="bg-slate-900 border border-slate-800 rounded-xl p-4"
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                            <TrendingUp size={16} />
                                            <span>Growth Rate</span>
                                        </div>
                                        <p className={`text-2xl font-bold font-mono ${industry.growthRate >= 0 ? 'text-profit' : 'text-loss'}`}>
                                            {industry.growthRate >= 0 ? '+' : ''}{industry.growthRate}%
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        className="bg-slate-900 border border-slate-800 rounded-xl p-4"
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                            <Target size={16} />
                                            <span>Outlook</span>
                                        </div>
                                        <p className={`text-2xl font-bold ${industry.outlook === 'Bullish' ? 'text-profit' :
                                            industry.outlook === 'Bearish' ? 'text-loss' : 'text-yellow-500'
                                            }`}>
                                            {industry.outlook}
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                    {/* Overview */}
                                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <Icon style={{ color: industry.color }} size={20} />
                                            Industry Overview
                                        </h3>
                                        <p className="text-slate-300 mb-6">{industry.overview}</p>

                                        {/* Key Drivers */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-slate-400 mb-3">Key Growth Drivers</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {industry.keyDrivers.map((driver, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 rounded-full text-sm"
                                                        style={{ backgroundColor: `${industry.color}20`, color: industry.color }}
                                                    >
                                                        {driver}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Risks */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                                <AlertTriangle size={14} className="text-yellow-500" />
                                                Risk Factors
                                            </h4>
                                            <ul className="space-y-2">
                                                {industry.risks.map((risk, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                                                        {risk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Radar Chart */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Industry Metrics</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <RadarChart data={radarData}>
                                                <PolarGrid stroke="#334155" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                                                <Radar
                                                    name="Metrics"
                                                    dataKey="value"
                                                    stroke={industry.color}
                                                    fill={industry.color}
                                                    fillOpacity={0.3}
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Historical Growth Chart */}
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                                    <h3 className="text-lg font-semibold text-white mb-4">Historical Performance (YoY %)</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={industry.historicalGrowth}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="year" tick={{ fill: '#94a3b8' }} />
                                            <YAxis tick={{ fill: '#94a3b8' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                                labelStyle={{ color: '#fff' }}
                                            />
                                            <Bar
                                                dataKey="growth"
                                                fill={industry.color}
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Top Companies */}
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Top Companies</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-800">
                                                    <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Company</th>
                                                    <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Ticker</th>
                                                    <th className="text-right text-xs text-slate-400 font-medium py-3 px-2">P/E Ratio</th>
                                                    <th className="text-right text-xs text-slate-400 font-medium py-3 px-2">YoY Growth</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {industry.topCompanies.map((company, i) => (
                                                    <motion.tr
                                                        key={company.ticker}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors"
                                                    >
                                                        <td className="py-3 px-2 text-white font-medium">{company.name}</td>
                                                        <td className="py-3 px-2 text-slate-400 font-mono">{company.ticker}</td>
                                                        <td className="py-3 px-2 text-right text-white font-mono">{company.pe}x</td>
                                                        <td className={`py-3 px-2 text-right font-mono font-semibold ${company.growth >= 0 ? 'text-profit' : 'text-loss'}`}>
                                                            {company.growth >= 0 ? '+' : ''}{company.growth}%
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}

