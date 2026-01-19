import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    PieChart,
    BarChart3,
    Shield,
    Target,
    Zap,
    Edit2,
    Save,
    X,
    Search
} from 'lucide-react';
import {
    PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

// Stock database with risk profiles
const STOCK_DATABASE = {
    // Technology
    'AAPL': { name: 'Apple Inc', sector: 'Technology', beta: 1.28, volatility: 0.24, dividendYield: 0.5 },
    'MSFT': { name: 'Microsoft Corp', sector: 'Technology', beta: 0.92, volatility: 0.22, dividendYield: 0.8 },
    'GOOGL': { name: 'Alphabet Inc', sector: 'Technology', beta: 1.05, volatility: 0.26, dividendYield: 0 },
    'NVDA': { name: 'NVIDIA Corp', sector: 'Technology', beta: 1.72, volatility: 0.45, dividendYield: 0.04 },
    'TSLA': { name: 'Tesla Inc', sector: 'Technology', beta: 2.08, volatility: 0.55, dividendYield: 0 },
    'META': { name: 'Meta Platforms', sector: 'Technology', beta: 1.35, volatility: 0.38, dividendYield: 0.4 },
    'AMZN': { name: 'Amazon.com Inc', sector: 'Technology', beta: 1.18, volatility: 0.30, dividendYield: 0 },
    'AMD': { name: 'AMD Inc', sector: 'Technology', beta: 1.85, volatility: 0.48, dividendYield: 0 },
    'INTC': { name: 'Intel Corp', sector: 'Technology', beta: 0.98, volatility: 0.32, dividendYield: 1.5 },
    'CRM': { name: 'Salesforce Inc', sector: 'Technology', beta: 1.15, volatility: 0.28, dividendYield: 0 },
    // India Technology
    'TCS': { name: 'Tata Consultancy', sector: 'Technology', beta: 0.75, volatility: 0.18, dividendYield: 1.2 },
    'INFY': { name: 'Infosys Ltd', sector: 'Technology', beta: 0.82, volatility: 0.20, dividendYield: 2.1 },
    'WIPRO': { name: 'Wipro Ltd', sector: 'Technology', beta: 0.78, volatility: 0.22, dividendYield: 1.8 },
    'HCLTECH': { name: 'HCL Technologies', sector: 'Technology', beta: 0.68, volatility: 0.19, dividendYield: 3.2 },
    // Healthcare
    'UNH': { name: 'UnitedHealth Group', sector: 'Healthcare', beta: 0.72, volatility: 0.18, dividendYield: 1.4 },
    'JNJ': { name: 'Johnson & Johnson', sector: 'Healthcare', beta: 0.55, volatility: 0.14, dividendYield: 2.9 },
    'PFE': { name: 'Pfizer Inc', sector: 'Healthcare', beta: 0.65, volatility: 0.22, dividendYield: 5.8 },
    'LLY': { name: 'Eli Lilly', sector: 'Healthcare', beta: 0.42, volatility: 0.25, dividendYield: 0.8 },
    'MRK': { name: 'Merck & Co', sector: 'Healthcare', beta: 0.48, volatility: 0.18, dividendYield: 2.5 },
    // Financial
    'JPM': { name: 'JPMorgan Chase', sector: 'Financial', beta: 1.15, volatility: 0.25, dividendYield: 2.4 },
    'BAC': { name: 'Bank of America', sector: 'Financial', beta: 1.42, volatility: 0.32, dividendYield: 2.8 },
    'V': { name: 'Visa Inc', sector: 'Financial', beta: 0.95, volatility: 0.20, dividendYield: 0.8 },
    'MA': { name: 'Mastercard Inc', sector: 'Financial', beta: 1.05, volatility: 0.22, dividendYield: 0.6 },
    'GS': { name: 'Goldman Sachs', sector: 'Financial', beta: 1.35, volatility: 0.30, dividendYield: 2.5 },
    // India Financial
    'HDFCBANK': { name: 'HDFC Bank', sector: 'Financial', beta: 0.92, volatility: 0.22, dividendYield: 1.1 },
    'ICICIBANK': { name: 'ICICI Bank', sector: 'Financial', beta: 1.08, volatility: 0.25, dividendYield: 0.8 },
    'KOTAKBANK': { name: 'Kotak Mahindra Bank', sector: 'Financial', beta: 0.95, volatility: 0.23, dividendYield: 0.1 },
    'SBIN': { name: 'State Bank of India', sector: 'Financial', beta: 1.25, volatility: 0.28, dividendYield: 1.8 },
    // Consumer
    'KO': { name: 'Coca-Cola Co', sector: 'Consumer', beta: 0.58, volatility: 0.14, dividendYield: 3.1 },
    'PG': { name: 'Procter & Gamble', sector: 'Consumer', beta: 0.45, volatility: 0.12, dividendYield: 2.4 },
    'WMT': { name: 'Walmart Inc', sector: 'Consumer', beta: 0.52, volatility: 0.15, dividendYield: 1.4 },
    'NKE': { name: 'Nike Inc', sector: 'Consumer', beta: 1.10, volatility: 0.28, dividendYield: 1.5 },
    'MCD': { name: 'McDonald\'s Corp', sector: 'Consumer', beta: 0.65, volatility: 0.16, dividendYield: 2.2 },
    // India Consumer
    'HINDUNILVR': { name: 'Hindustan Unilever', sector: 'Consumer', beta: 0.45, volatility: 0.15, dividendYield: 1.6 },
    'ITC': { name: 'ITC Ltd', sector: 'Consumer', beta: 0.72, volatility: 0.18, dividendYield: 3.2 },
    'ASIANPAINT': { name: 'Asian Paints', sector: 'Consumer', beta: 0.85, volatility: 0.22, dividendYield: 0.8 },
    // Energy
    'XOM': { name: 'Exxon Mobil', sector: 'Energy', beta: 0.92, volatility: 0.28, dividendYield: 3.5 },
    'CVX': { name: 'Chevron Corp', sector: 'Energy', beta: 1.05, volatility: 0.26, dividendYield: 4.0 },
    'OXY': { name: 'Occidental Petroleum', sector: 'Energy', beta: 1.85, volatility: 0.42, dividendYield: 1.2 },
    // India Energy
    'RELIANCE': { name: 'Reliance Industries', sector: 'Energy', beta: 0.95, volatility: 0.22, dividendYield: 0.4 },
    'ONGC': { name: 'Oil & Natural Gas Corp', sector: 'Energy', beta: 1.15, volatility: 0.28, dividendYield: 4.5 },
    // Industrial
    'CAT': { name: 'Caterpillar Inc', sector: 'Industrial', beta: 1.05, volatility: 0.25, dividendYield: 1.6 },
    'HON': { name: 'Honeywell Intl', sector: 'Industrial', beta: 1.02, volatility: 0.22, dividendYield: 2.0 },
    'UPS': { name: 'United Parcel Service', sector: 'Industrial', beta: 1.15, volatility: 0.24, dividendYield: 4.2 },
    'BA': { name: 'Boeing Co', sector: 'Industrial', beta: 1.45, volatility: 0.38, dividendYield: 0 },
    // India Industrial
    'LT': { name: 'Larsen & Toubro', sector: 'Industrial', beta: 1.18, volatility: 0.25, dividendYield: 0.9 },
    'TATASTEEL': { name: 'Tata Steel', sector: 'Industrial', beta: 1.45, volatility: 0.35, dividendYield: 2.5 },
};

const SECTOR_COLORS = {
    'Technology': '#3b82f6',
    'Healthcare': '#10b981',
    'Financial': '#f97316',
    'Consumer': '#8b5cf6',
    'Energy': '#ef4444',
    'Industrial': '#64748b'
};

// Risk calculation functions
function calculatePortfolioBeta(holdings, totalValue) {
    if (totalValue === 0) return 0;
    return holdings.reduce((sum, h) => {
        const stock = STOCK_DATABASE[h.symbol.toUpperCase()];
        const weight = h.value / totalValue;
        return sum + (stock?.beta || 1) * weight;
    }, 0);
}

function calculateVolatility(holdings, totalValue) {
    if (totalValue === 0) return 0;
    // Simplified portfolio volatility (weighted average)
    return holdings.reduce((sum, h) => {
        const stock = STOCK_DATABASE[h.symbol.toUpperCase()];
        const weight = h.value / totalValue;
        return sum + (stock?.volatility || 0.25) * weight;
    }, 0);
}

function calculateSharpeRatio(expectedReturn, riskFreeRate, volatility) {
    if (volatility === 0) return 0;
    return (expectedReturn - riskFreeRate) / volatility;
}

function calculateRiskScore(beta, volatility, sectorConcentration) {
    // Composite risk score (1-10 scale)
    const betaScore = Math.min(beta * 3, 10);
    const volScore = volatility * 20;
    const concScore = (sectorConcentration / 100) * 10;
    return Math.min(10, ((betaScore + volScore + concScore) / 3)).toFixed(1);
}

function getRiskLevel(score) {
    if (score <= 3) return { label: 'Low', color: 'text-profit', bg: 'bg-profit/20' };
    if (score <= 6) return { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    return { label: 'High', color: 'text-loss', bg: 'bg-loss/20' };
}

export default function PortfolioHoldings({ onHoldingsChange }) {
    const [holdings, setHoldings] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStock, setNewStock] = useState({ symbol: '', shares: '', avgPrice: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    // Filter stocks based on search
    const filteredStocks = useMemo(() => {
        if (!searchQuery) return [];
        const query = searchQuery.toLowerCase();
        return Object.entries(STOCK_DATABASE)
            .filter(([symbol, data]) =>
                symbol.toLowerCase().includes(query) ||
                data.name.toLowerCase().includes(query)
            )
            .slice(0, 8);
    }, [searchQuery]);

    // Calculate portfolio metrics
    const portfolioMetrics = useMemo(() => {
        const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

        // Sector allocation
        const sectors = {};
        holdings.forEach(h => {
            const stock = STOCK_DATABASE[h.symbol.toUpperCase()];
            const sector = stock?.sector || 'Other';
            sectors[sector] = (sectors[sector] || 0) + h.value;
        });

        const sectorAllocation = Object.entries(sectors).map(([name, value]) => ({
            name,
            value: totalValue > 0 ? (value / totalValue) * 100 : 0,
            amount: value,
            color: SECTOR_COLORS[name] || '#64748b'
        })).sort((a, b) => b.value - a.value);

        const maxConcentration = sectorAllocation.length > 0 ? sectorAllocation[0].value : 0;

        const beta = calculatePortfolioBeta(holdings, totalValue);
        const volatility = calculateVolatility(holdings, totalValue);
        const expectedReturn = 0.12; // Assumed 12% expected return
        const riskFreeRate = 0.05; // 5% risk-free rate
        const sharpeRatio = calculateSharpeRatio(expectedReturn, riskFreeRate, volatility);
        const riskScore = calculateRiskScore(beta, volatility, maxConcentration);

        // Calculate dividend yield
        const dividendYield = holdings.reduce((sum, h) => {
            const stock = STOCK_DATABASE[h.symbol.toUpperCase()];
            const weight = totalValue > 0 ? h.value / totalValue : 0;
            return sum + (stock?.dividendYield || 0) * weight;
        }, 0);

        return {
            totalValue,
            holdingsCount: holdings.length,
            beta,
            volatility,
            sharpeRatio,
            riskScore,
            riskLevel: getRiskLevel(riskScore),
            sectorAllocation,
            maxConcentration,
            dividendYield
        };
    }, [holdings]);

    // Risk alerts based on portfolio
    const riskAlerts = useMemo(() => {
        const alerts = [];

        if (portfolioMetrics.maxConcentration > 40) {
            alerts.push({
                severity: 'high',
                title: 'High Sector Concentration',
                message: `${portfolioMetrics.sectorAllocation[0]?.name} sector is ${portfolioMetrics.maxConcentration.toFixed(1)}% of portfolio`,
                recommendation: 'Consider diversifying into other sectors'
            });
        }

        if (portfolioMetrics.beta > 1.3) {
            alerts.push({
                severity: 'high',
                title: 'High Portfolio Beta',
                message: `Portfolio beta of ${portfolioMetrics.beta.toFixed(2)} indicates higher market sensitivity`,
                recommendation: 'Add defensive stocks to reduce beta'
            });
        }

        if (portfolioMetrics.volatility > 0.35) {
            alerts.push({
                severity: 'medium',
                title: 'Elevated Volatility',
                message: `Portfolio volatility of ${(portfolioMetrics.volatility * 100).toFixed(1)}% is above average`,
                recommendation: 'Include low-volatility stocks for stability'
            });
        }

        if (holdings.length < 5 && holdings.length > 0) {
            alerts.push({
                severity: 'medium',
                title: 'Limited Diversification',
                message: `Only ${holdings.length} holdings may not provide adequate diversification`,
                recommendation: 'Aim for 10-15 holdings across different sectors'
            });
        }

        if (holdings.length > 0 && portfolioMetrics.dividendYield < 1) {
            alerts.push({
                severity: 'low',
                title: 'Low Dividend Yield',
                message: `Portfolio dividend yield of ${portfolioMetrics.dividendYield.toFixed(2)}% is low`,
                recommendation: 'Consider adding dividend-paying stocks for income'
            });
        }

        return alerts;
    }, [holdings, portfolioMetrics]);

    const handleAddStock = () => {
        const symbol = newStock.symbol.toUpperCase();
        const shares = parseFloat(newStock.shares);
        const avgPrice = parseFloat(newStock.avgPrice);

        const newErrors = {};
        if (!STOCK_DATABASE[symbol]) newErrors.symbol = 'Stock not found in database';
        if (isNaN(shares) || shares <= 0) newErrors.shares = 'Enter valid shares';
        if (isNaN(avgPrice) || avgPrice <= 0) newErrors.avgPrice = 'Enter valid price';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const stock = STOCK_DATABASE[symbol];
        const newHolding = {
            id: Date.now(),
            symbol,
            name: stock.name,
            sector: stock.sector,
            shares,
            avgPrice,
            value: shares * avgPrice,
            beta: stock.beta,
            riskLevel: stock.beta > 1.3 ? 'High' : stock.beta > 0.8 ? 'Medium' : 'Low'
        };

        // Check if stock already exists
        const existingIndex = holdings.findIndex(h => h.symbol === symbol);
        if (existingIndex >= 0) {
            const updated = [...holdings];
            updated[existingIndex] = {
                ...updated[existingIndex],
                shares: updated[existingIndex].shares + shares,
                value: (updated[existingIndex].shares + shares) * avgPrice,
                avgPrice: ((updated[existingIndex].avgPrice * updated[existingIndex].shares) + (avgPrice * shares)) / (updated[existingIndex].shares + shares)
            };
            setHoldings(updated);
        } else {
            setHoldings([...holdings, newHolding]);
        }

        setNewStock({ symbol: '', shares: '', avgPrice: '' });
        setShowAddForm(false);
        setSearchQuery('');
        setErrors({});
    };

    const handleRemoveStock = (id) => {
        setHoldings(holdings.filter(h => h.id !== id));
    };

    const selectStock = (symbol) => {
        setNewStock(prev => ({ ...prev, symbol }));
        setSearchQuery('');
    };

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <PieChart size={20} className="text-indus-400" />
                            Your Portfolio Holdings
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            Add your stock holdings to get personalized risk analysis
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indus-500 hover:bg-indus-600 text-white rounded-lg transition-colors"
                    >
                        <Plus size={18} />
                        Add Stock
                    </button>
                </div>

                {/* Add Stock Form */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-slate-800 pt-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Stock Symbol with Search */}
                                <div className="relative">
                                    <label className="text-xs text-slate-400 mb-1 block">Stock Symbol</label>
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search AAPL, RELIANCE..."
                                            value={newStock.symbol || searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setNewStock(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }));
                                            }}
                                            className={`w-full pl-9 pr-3 py-2 bg-slate-800 border rounded-lg text-white text-sm focus:outline-none focus:border-indus-500 ${errors.symbol ? 'border-red-500' : 'border-slate-700'}`}
                                        />
                                    </div>
                                    {errors.symbol && <p className="text-xs text-red-400 mt-1">{errors.symbol}</p>}

                                    {/* Stock Suggestions */}
                                    {filteredStocks.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden z-50 max-h-48 overflow-y-auto">
                                            {filteredStocks.map(([symbol, data]) => (
                                                <button
                                                    key={symbol}
                                                    onClick={() => selectStock(symbol)}
                                                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-700 transition-colors text-left"
                                                >
                                                    <div>
                                                        <span className="text-white font-medium">{symbol}</span>
                                                        <span className="text-slate-400 text-sm ml-2">{data.name}</span>
                                                    </div>
                                                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${SECTOR_COLORS[data.sector]}20`, color: SECTOR_COLORS[data.sector] }}>
                                                        {data.sector}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Number of Shares</label>
                                    <input
                                        type="number"
                                        placeholder="100"
                                        value={newStock.shares}
                                        onChange={(e) => setNewStock(prev => ({ ...prev, shares: e.target.value }))}
                                        className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white text-sm focus:outline-none focus:border-indus-500 ${errors.shares ? 'border-red-500' : 'border-slate-700'}`}
                                    />
                                    {errors.shares && <p className="text-xs text-red-400 mt-1">{errors.shares}</p>}
                                </div>

                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Average Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="150.00"
                                        value={newStock.avgPrice}
                                        onChange={(e) => setNewStock(prev => ({ ...prev, avgPrice: e.target.value }))}
                                        className={`w-full px-3 py-2 bg-slate-800 border rounded-lg text-white text-sm focus:outline-none focus:border-indus-500 ${errors.avgPrice ? 'border-red-500' : 'border-slate-700'}`}
                                    />
                                    {errors.avgPrice && <p className="text-xs text-red-400 mt-1">{errors.avgPrice}</p>}
                                </div>

                                <div className="flex items-end gap-2">
                                    <button
                                        onClick={handleAddStock}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-profit hover:bg-profit/80 text-white rounded-lg transition-colors"
                                    >
                                        <Save size={16} />
                                        Add
                                    </button>
                                    <button
                                        onClick={() => { setShowAddForm(false); setErrors({}); }}
                                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Holdings Table */}
                {holdings.length > 0 ? (
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Symbol</th>
                                    <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Name</th>
                                    <th className="text-left text-xs text-slate-400 font-medium py-3 px-2">Sector</th>
                                    <th className="text-right text-xs text-slate-400 font-medium py-3 px-2">Shares</th>
                                    <th className="text-right text-xs text-slate-400 font-medium py-3 px-2">Avg Price</th>
                                    <th className="text-right text-xs text-slate-400 font-medium py-3 px-2">Value</th>
                                    <th className="text-center text-xs text-slate-400 font-medium py-3 px-2">Risk</th>
                                    <th className="text-center text-xs text-slate-400 font-medium py-3 px-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map((holding, i) => (
                                    <motion.tr
                                        key={holding.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="border-b border-slate-800/50 hover:bg-slate-800/30"
                                    >
                                        <td className="py-3 px-2 text-white font-mono font-semibold">{holding.symbol}</td>
                                        <td className="py-3 px-2 text-slate-300">{holding.name}</td>
                                        <td className="py-3 px-2">
                                            <span
                                                className="text-xs px-2 py-1 rounded"
                                                style={{ backgroundColor: `${SECTOR_COLORS[holding.sector]}20`, color: SECTOR_COLORS[holding.sector] }}
                                            >
                                                {holding.sector}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-right text-white font-mono">{holding.shares.toLocaleString()}</td>
                                        <td className="py-3 px-2 text-right text-white font-mono">${holding.avgPrice.toFixed(2)}</td>
                                        <td className="py-3 px-2 text-right text-white font-mono font-semibold">
                                            ${holding.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`text-xs px-2 py-1 rounded ${holding.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                                                    holding.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-green-500/20 text-green-400'
                                                }`}>
                                                {holding.riskLevel}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <button
                                                onClick={() => handleRemoveStock(holding.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-slate-700">
                                    <td colSpan="5" className="py-3 px-2 text-slate-400 font-medium">Total Portfolio Value</td>
                                    <td className="py-3 px-2 text-right text-white font-mono font-bold text-lg">
                                        ${portfolioMetrics.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                    </td>
                                    <td colSpan="2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                ) : (
                    <div className="mt-4 py-12 text-center border border-dashed border-slate-700 rounded-lg">
                        <PieChart size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">No holdings added yet</p>
                        <p className="text-sm text-slate-500 mt-1">Click "Add Stock" to start building your portfolio</p>
                    </div>
                )}
            </div>

            {/* Risk Analysis Section - Only show when there are holdings */}
            {holdings.length > 0 && (
                <>
                    {/* Risk Alerts */}
                    {riskAlerts.length > 0 && (
                        <div className="space-y-3">
                            {riskAlerts.map((alert, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-4 rounded-lg border ${alert.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
                                            alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                                'bg-blue-500/10 border-blue-500/30'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle size={18} className={
                                            alert.severity === 'high' ? 'text-red-400' :
                                                alert.severity === 'medium' ? 'text-yellow-400' :
                                                    'text-blue-400'
                                        } />
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium">{alert.title}</h4>
                                            <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
                                            <p className="text-sm text-slate-300 mt-2 flex items-center gap-2">
                                                <Target size={14} className="text-indus-400" />
                                                {alert.recommendation}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Risk Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                        >
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                <Shield size={16} />
                                <span>Risk Score</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-mono font-bold text-white">{portfolioMetrics.riskScore}</span>
                                <span className={`text-sm mb-1 px-2 py-0.5 rounded ${portfolioMetrics.riskLevel.bg} ${portfolioMetrics.riskLevel.color}`}>
                                    {portfolioMetrics.riskLevel.label}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Composite risk score (1-10)</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                        >
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                <TrendingUp size={16} />
                                <span>Portfolio Beta</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-mono font-bold text-white">{portfolioMetrics.beta.toFixed(2)}</span>
                                <span className="text-sm text-slate-500 mb-1">vs Market</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                {portfolioMetrics.beta > 1
                                    ? `${((portfolioMetrics.beta - 1) * 100).toFixed(0)}% more volatile than market`
                                    : `${((1 - portfolioMetrics.beta) * 100).toFixed(0)}% less volatile than market`}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                        >
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                <BarChart3 size={16} />
                                <span>Sharpe Ratio</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-mono font-bold text-white">{portfolioMetrics.sharpeRatio.toFixed(2)}</span>
                                <span className={`text-sm mb-1 ${portfolioMetrics.sharpeRatio > 1 ? 'text-profit' : portfolioMetrics.sharpeRatio > 0.5 ? 'text-yellow-400' : 'text-loss'}`}>
                                    {portfolioMetrics.sharpeRatio > 1 ? 'Excellent' : portfolioMetrics.sharpeRatio > 0.5 ? 'Good' : 'Poor'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Risk-adjusted return measure</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                        >
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                <Zap size={16} />
                                <span>Volatility</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-mono font-bold text-white">{(portfolioMetrics.volatility * 100).toFixed(1)}%</span>
                                <span className="text-sm text-slate-500 mb-1">Annual</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Expected price fluctuation range</p>
                        </motion.div>
                    </div>

                    {/* Sector Allocation Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <PieChart size={20} className="text-indus-400" />
                                Sector Allocation
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <RePieChart>
                                    <Pie
                                        data={portfolioMetrics.sectorAllocation}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                    >
                                        {portfolioMetrics.sectorAllocation.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                        formatter={(value) => [`${value.toFixed(1)}%`, 'Allocation']}
                                    />
                                    <Legend
                                        formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
                                    />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Diversification Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-slate-300">Total Holdings</span>
                                    <span className="text-white font-mono font-semibold">{holdings.length} stocks</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-slate-300">Sectors Covered</span>
                                    <span className="text-white font-mono font-semibold">{portfolioMetrics.sectorAllocation.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-slate-300">Max Sector Concentration</span>
                                    <span className={`font-mono font-semibold ${portfolioMetrics.maxConcentration > 40 ? 'text-loss' : 'text-profit'}`}>
                                        {portfolioMetrics.maxConcentration.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <span className="text-slate-300">Portfolio Dividend Yield</span>
                                    <span className="text-white font-mono font-semibold">{portfolioMetrics.dividendYield.toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
