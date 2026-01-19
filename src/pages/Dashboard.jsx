import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import MarketTicker from '../components/dashboard/MarketTicker';
import MetricCard from '../components/dashboard/MetricCard';
import PortfolioChart from '../components/dashboard/PortfolioChart';
import MarketNews from '../components/dashboard/MarketNews';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { dashboardMetrics, riskTrend } from '../lib/mockData';
import { staggerContainer, staggerItem, fadeInUp } from '../lib/animations.jsx';
import { useUserPreferences } from '../context/UserPreferencesContext';

export default function Dashboard() {
    const { userName, currencySymbol, riskTolerance, getRiskColor } = useUserPreferences();

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

    // Get display name (capitalize first letter)
    const displayName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : 'Analyst';

    return (
        <div className="relative">
            <AnimatedBackground />

            {/* Sticky Market Ticker */}
            <div className="sticky top-16 z-30 bg-slate-950">
                <MarketTicker />
            </div>

            <motion.div
                className="p-8 space-y-6 relative z-10"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
            >
                {/* Header with typing effect */}
                <motion.div variants={staggerItem}>
                    <motion.h1
                        className="text-3xl font-bold text-white mb-1 flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {greeting}, <span className="gradient-text">{displayName}</span>
                        <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Sparkles className="text-indus-500" size={24} />
                        </motion.div>
                    </motion.h1>
                    <motion.p
                        className="text-slate-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Here's your portfolio overview for today
                    </motion.p>
                </motion.div>

                {/* Metrics Grid with stagger */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={staggerContainer}
                >
                    <MetricCard
                        title="Portfolio Value"
                        value={dashboardMetrics.portfolioValue}
                        change={dashboardMetrics.portfolioValueChange}
                        changePercent={dashboardMetrics.portfolioValueChangePercent}
                        icon={DollarSign}
                        currency={currencySymbol}
                        delay={0}
                    />
                    <MetricCard
                        title="Today's Gain"
                        value={dashboardMetrics.daysGain}
                        change={dashboardMetrics.daysGain}
                        changePercent={dashboardMetrics.daysGainPercent}
                        icon={TrendingUp}
                        currency={currencySymbol}
                        delay={0.1}
                    />
                    <MetricCard
                        title="Risk Score"
                        value={dashboardMetrics.riskScore.toFixed(1)}
                        change={dashboardMetrics.riskChange}
                        changePercent={(dashboardMetrics.riskChange / dashboardMetrics.riskScore) * 100}
                        icon={ShieldCheck}
                        delay={0.2}
                        riskTolerance={riskTolerance}
                        trendIndicator={{
                            direction: riskTrend.direction,
                            value: riskTrend.change,
                            period: riskTrend.period
                        }}
                    />
                </motion.div>

                {/* Main Content Grid with fade in */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    variants={staggerItem}
                >
                    {/* Portfolio Chart - Takes 2 columns */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <PortfolioChart />
                    </motion.div>

                    {/* Market News - Takes 1 column */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <MarketNews />
                    </motion.div>
                </motion.div>

                {/* Quick Insights with hover effects */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <motion.div
                        className="bg-slate-900 border border-slate-800 rounded-md p-6 hover:border-indus-500/30 transition-colors"
                        whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <h3 className="text-lg font-semibold text-white mb-3">Market Highlights</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                'NIFTY 50 up 0.53% led by IT and Banking sectors',
                                'India VIX declining -4.2%, indicating market confidence',
                                'FIIs net buyers: ₹2,450 Cr inflow today',
                                'Your portfolio outperforming NIFTY 50 by +12.8% YTD'
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    className="flex items-start gap-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                >
                                    <motion.span
                                        className="text-indus-500"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                                    >
                                        •
                                    </motion.span>
                                    <span className="text-slate-300">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        className="bg-slate-900 border border-slate-800 rounded-md p-6 hover:border-indus-500/30 transition-colors"
                        whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <h3 className="text-lg font-semibold text-white mb-3">Top Performers Today</h3>
                        <div className="space-y-3">
                            {[
                                { symbol: 'INFY', name: 'Infosys Ltd', change: '+2.85%', price: '₹1,842.50' },
                                { symbol: 'TCS', name: 'Tata Consultancy', change: '+2.18%', price: '₹4,125.30' },
                                { symbol: 'RELIANCE', name: 'Reliance Industries', change: '+1.45%', price: '₹2,456.75' }
                            ].map((stock, i) => (
                                <motion.div
                                    key={stock.symbol}
                                    className="flex justify-between items-center p-2 rounded-md hover:bg-slate-800/50 transition-colors cursor-pointer"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + i * 0.1 }}
                                    whileHover={{ x: 4 }}
                                >
                                    <div>
                                        <div className="text-white font-medium">{stock.symbol}</div>
                                        <div className="text-xs text-slate-400">{stock.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <motion.div
                                            className="text-profit font-mono font-semibold"
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.9 + i * 0.1, type: 'spring' }}
                                        >
                                            {stock.change}
                                        </motion.div>
                                        <div className="text-xs text-slate-400">{stock.price}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
