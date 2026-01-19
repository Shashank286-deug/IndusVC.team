import { useState } from 'react';
import SectorAllocationChart from '../components/risk/SectorAllocationChart';
import CorrelationMatrix from '../components/risk/CorrelationMatrix';
import RiskTable from '../components/risk/RiskTable';
import AlertBanner from '../components/risk/AlertBanner';
import PortfolioHoldings from '../components/risk/PortfolioHoldings';
import { riskAlerts } from '../lib/mockData';
import { ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioRisk() {
    const [showSampleData, setShowSampleData] = useState(false);

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                    <ShieldAlert className="text-indus-500" size={32} />
                    Portfolio <span className="gradient-text">Risk Analysis</span>
                </h1>
                <p className="text-slate-400">Enter your holdings and get personalized risk insights</p>
            </div>

            {/* Portfolio Holdings Input Section */}
            <PortfolioHoldings />

            {/* Sample Data Toggle */}
            <div className="mt-8 border-t border-slate-800 pt-6">
                <button
                    onClick={() => setShowSampleData(!showSampleData)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    {showSampleData ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    <span className="text-sm">{showSampleData ? 'Hide' : 'Show'} Sample Analysis (Demo Data)</span>
                </button>
            </div>

            {/* Sample Data Section */}
            <AnimatePresence>
                {showSampleData && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg mb-6">
                            <p className="text-sm text-slate-400">
                                📊 Below is sample analysis using demo data to show what your analysis could look like
                            </p>
                        </div>

                        {/* Risk Alerts */}
                        <div className="space-y-3 mb-6">
                            {riskAlerts.map((alert) => (
                                <AlertBanner
                                    key={alert.id}
                                    severity={alert.severity}
                                    title={alert.title}
                                    message={alert.message}
                                    recommendation={alert.recommendation}
                                />
                            ))}
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <div className="lg:col-span-1">
                                <SectorAllocationChart />
                                {/* Correlation Matrix below Sector Allocation */}
                                <CorrelationMatrix />
                            </div>
                            <div className="lg:col-span-2">
                                <RiskTable />
                            </div>
                        </div>

                        {/* Risk Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-md p-6">
                                <h3 className="text-slate-400 text-sm font-medium mb-3">Portfolio Beta</h3>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-mono font-bold text-white">1.24</span>
                                    <span className="text-sm text-slate-500 mb-1">vs Market</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">24% more volatile than S&P 500</p>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-md p-6">
                                <h3 className="text-slate-400 text-sm font-medium mb-3">Sharpe Ratio</h3>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-mono font-bold text-white">1.87</span>
                                    <span className="text-sm text-profit mb-1">Excellent</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Risk-adjusted returns above benchmark</p>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-md p-6">
                                <h3 className="text-slate-400 text-sm font-medium mb-3">Max Drawdown</h3>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-mono font-bold text-white">-12.4%</span>
                                    <span className="text-sm text-slate-500 mb-1">Past Year</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Peak to trough decline in portfolio value</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

