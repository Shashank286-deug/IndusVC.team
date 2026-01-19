import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../ui/Card';
import { motion } from 'framer-motion';

// Risk thresholds based on tolerance level
const RISK_THRESHOLDS = {
    'Conservative': { low: 3, medium: 5 },
    'Moderate': { low: 4, medium: 6 },
    'Aggressive': { low: 5, medium: 7 }
};

export default function MetricCard({
    title,
    value,
    change,
    changePercent,
    icon: Icon,
    delay = 0,
    currency = '$',
    trendIndicator = null, // { direction: 'up'|'down', value: number, period: string }
    riskTolerance = 'Moderate' // 'Conservative', 'Moderate', 'Aggressive'
}) {
    const isPositive = change >= 0;

    // Format value based on size
    const formatValue = (val) => {
        if (typeof val !== 'number') return val;

        if (currency === '₹') {
            // Indian numbering system (lakhs, crores)
            if (val >= 10000000) {
                return `${currency}${(val / 10000000).toFixed(2)} Cr`;
            } else if (val >= 100000) {
                return `${currency}${(val / 100000).toFixed(2)} L`;
            } else {
                return `${currency}${val.toLocaleString('en-IN')}`;
            }
        } else {
            // US numbering system
            if (val >= 1000000) {
                return `${currency}${(val / 1000000).toFixed(1)}M`;
            } else if (val >= 1000) {
                return `${currency}${(val / 1000).toFixed(1)}K`;
            }
            return `${currency}${val.toLocaleString()}`;
        }
    };

    const formatChange = (val) => {
        if (typeof val !== 'number') return val;

        if (currency === '₹') {
            if (Math.abs(val) >= 100000) {
                return `${currency}${(val / 100000).toFixed(2)} L`;
            } else if (Math.abs(val) >= 1000) {
                return `${currency}${val.toLocaleString('en-IN')}`;
            }
            return `${currency}${val.toLocaleString('en-IN')}`;
        } else {
            if (Math.abs(val) >= 1000) {
                return `${currency}${(val / 1000).toFixed(1)}K`;
            }
            return `${currency}${val.toLocaleString()}`;
        }
    };

    // For risk score, color based on tolerance level
    const isRiskMetric = title?.toLowerCase().includes('risk');

    // Get risk color based on score and tolerance
    const getRiskScoreColor = (score) => {
        if (!isRiskMetric) return null;
        const numScore = parseFloat(score);
        const thresholds = RISK_THRESHOLDS[riskTolerance] || RISK_THRESHOLDS['Moderate'];

        if (numScore <= thresholds.low) return 'text-profit';
        if (numScore <= thresholds.medium) return 'text-yellow-400';
        return 'text-loss';
    };

    const getRiskLabel = (score) => {
        if (!isRiskMetric) return null;
        const numScore = parseFloat(score);
        const thresholds = RISK_THRESHOLDS[riskTolerance] || RISK_THRESHOLDS['Moderate'];

        if (numScore <= thresholds.low) return 'Low';
        if (numScore <= thresholds.medium) return 'Moderate';
        return 'High';
    };

    const trendIsGood = trendIndicator
        ? (isRiskMetric
            ? trendIndicator.direction === 'down'
            : trendIndicator.direction === 'up')
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
        >
            <Card hover className="relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indus-500/5 rounded-full blur-3xl"></div>

                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
                        {Icon && <Icon className="text-slate-600" size={20} />}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-end gap-3">
                            <div className={`financial-value text-3xl ${isRiskMetric ? getRiskScoreColor(value) : 'text-white'}`}>
                                {formatValue(value)}
                                {isRiskMetric && (
                                    <span className="text-sm font-normal text-slate-400 ml-2">
                                        ({getRiskLabel(value)})
                                    </span>
                                )}
                            </div>

                            {/* Trend Indicator */}
                            {trendIndicator && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
                                        ${trendIsGood
                                            ? 'bg-profit/10 text-profit'
                                            : 'bg-loss/10 text-loss'
                                        }
                                    `}
                                >
                                    {trendIndicator.direction === 'up' ? (
                                        <ArrowUp size={12} />
                                    ) : (
                                        <ArrowDown size={12} />
                                    )}
                                    <span>{trendIndicator.value}</span>
                                    <span className="text-slate-500 font-normal">{trendIndicator.period}</span>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {isPositive ? (
                                <TrendingUp className="text-profit" size={16} />
                            ) : (
                                <TrendingDown className="text-loss" size={16} />
                            )}
                            <span className={`text-sm font-medium ${isPositive ? 'text-profit' : 'text-loss'}`}>
                                {isPositive ? '+' : ''}{formatChange(change)}
                            </span>
                            <span className={`text-sm ${isPositive ? 'text-profit' : 'text-loss'}`}>
                                ({isPositive ? '+' : ''}{changePercent?.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

