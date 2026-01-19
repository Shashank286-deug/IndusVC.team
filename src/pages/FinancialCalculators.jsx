import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calculator,
    TrendingUp,
    Percent,
    PiggyBank,
    BarChart3,
    DollarSign,
    ArrowRight,
    RefreshCw,
    Wallet,
    Scale
} from 'lucide-react';
import AnimatedBackground from '../components/ui/AnimatedBackground';

// Calculator Components
function CalculatorCard({ title, icon: Icon, children, result, resultLabel }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indus-500/30 transition-colors"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indus-500/20 rounded-lg flex items-center justify-center">
                    <Icon className="text-indus-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>

            <div className="space-y-4">
                {children}
            </div>

            {result !== undefined && (
                <motion.div
                    className="mt-4 pt-4 border-t border-slate-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p className="text-xs text-slate-400 mb-1">{resultLabel}</p>
                    <p className="text-2xl font-bold text-indus-400 font-mono">{result}</p>
                </motion.div>
            )}
        </motion.div>
    );
}

function InputField({ label, value, onChange, prefix, suffix, type = 'number', step = '1' }) {
    return (
        <div>
            <label className="text-xs text-slate-400 block mb-1">{label}</label>
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{prefix}</span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    step={step}
                    className={`w-full bg-slate-800 border border-slate-700 rounded-md py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indus-500/50 focus:border-indus-500 ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'}`}
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{suffix}</span>
                )}
            </div>
        </div>
    );
}

// Individual Calculators
function CompoundInterestCalculator() {
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(8);
    const [years, setYears] = useState(5);
    const [compoundFreq, setCompoundFreq] = useState(12);

    const calculate = () => {
        const r = rate / 100;
        const n = compoundFreq;
        const t = years;
        const amount = principal * Math.pow(1 + r / n, n * t);
        const interest = amount - principal;
        return { amount: amount.toFixed(2), interest: interest.toFixed(2) };
    };

    const result = calculate();

    return (
        <CalculatorCard
            title="Compound Interest"
            icon={PiggyBank}
            result={`$${Number(result.amount).toLocaleString()}`}
            resultLabel={`Interest Earned: $${Number(result.interest).toLocaleString()}`}
        >
            <InputField label="Principal Amount" value={principal} onChange={setPrincipal} prefix="$" />
            <InputField label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" step="0.1" />
            <InputField label="Time Period (Years)" value={years} onChange={setYears} />
            <div>
                <label className="text-xs text-slate-400 block mb-1">Compound Frequency</label>
                <select
                    value={compoundFreq}
                    onChange={(e) => setCompoundFreq(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                >
                    <option value={1}>Annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                    <option value={365}>Daily</option>
                </select>
            </div>
        </CalculatorCard>
    );
}

function CAGRCalculator() {
    const [initialValue, setInitialValue] = useState(10000);
    const [finalValue, setFinalValue] = useState(25000);
    const [years, setYears] = useState(5);

    const calculate = () => {
        if (initialValue <= 0 || years <= 0) return 0;
        const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
        return cagr.toFixed(2);
    };

    return (
        <CalculatorCard
            title="CAGR Calculator"
            icon={TrendingUp}
            result={`${calculate()}%`}
            resultLabel="Compound Annual Growth Rate"
        >
            <InputField label="Initial Value" value={initialValue} onChange={setInitialValue} prefix="$" />
            <InputField label="Final Value" value={finalValue} onChange={setFinalValue} prefix="$" />
            <InputField label="Number of Years" value={years} onChange={setYears} />
        </CalculatorCard>
    );
}

function ROICalculator() {
    const [investment, setInvestment] = useState(10000);
    const [returns, setReturns] = useState(15000);

    const calculate = () => {
        if (investment <= 0) return { roi: 0, profit: 0 };
        const profit = returns - investment;
        const roi = (profit / investment) * 100;
        return { roi: roi.toFixed(2), profit: profit.toFixed(2) };
    };

    const result = calculate();

    return (
        <CalculatorCard
            title="ROI Calculator"
            icon={Percent}
            result={`${result.roi}%`}
            resultLabel={`Net Profit: $${Number(result.profit).toLocaleString()}`}
        >
            <InputField label="Initial Investment" value={investment} onChange={setInvestment} prefix="$" />
            <InputField label="Final Value / Returns" value={returns} onChange={setReturns} prefix="$" />
        </CalculatorCard>
    );
}

function PERatioCalculator() {
    const [stockPrice, setStockPrice] = useState(150);
    const [eps, setEps] = useState(5);

    const calculate = () => {
        if (eps <= 0) return { pe: 'N/A', valuation: 'N/A' };
        const pe = stockPrice / eps;
        let valuation = 'Fair Value';
        if (pe < 15) valuation = 'Undervalued';
        else if (pe > 25) valuation = 'Overvalued';
        return { pe: pe.toFixed(2), valuation };
    };

    const result = calculate();

    return (
        <CalculatorCard
            title="P/E Ratio"
            icon={BarChart3}
            result={result.pe}
            resultLabel={`Valuation: ${result.valuation}`}
        >
            <InputField label="Stock Price" value={stockPrice} onChange={setStockPrice} prefix="$" />
            <InputField label="Earnings Per Share (EPS)" value={eps} onChange={setEps} prefix="$" step="0.01" />
        </CalculatorCard>
    );
}

function EMICalculator() {
    const [principal, setPrincipal] = useState(500000);
    const [rate, setRate] = useState(8);
    const [tenure, setTenure] = useState(20);

    const calculate = () => {
        const monthlyRate = rate / 12 / 100;
        const months = tenure * 12;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        return {
            emi: emi.toFixed(2),
            totalPayment: totalPayment.toFixed(2),
            totalInterest: totalInterest.toFixed(2)
        };
    };

    const result = calculate();

    return (
        <CalculatorCard
            title="Loan EMI Calculator"
            icon={Wallet}
            result={`$${Number(result.emi).toLocaleString()}/mo`}
            resultLabel={`Total Interest: $${Number(result.totalInterest).toLocaleString()}`}
        >
            <InputField label="Loan Amount" value={principal} onChange={setPrincipal} prefix="$" />
            <InputField label="Interest Rate (Annual)" value={rate} onChange={setRate} suffix="%" step="0.1" />
            <InputField label="Loan Tenure (Years)" value={tenure} onChange={setTenure} />
        </CalculatorCard>
    );
}

function ProfitMarginCalculator() {
    const [revenue, setRevenue] = useState(100000);
    const [cost, setCost] = useState(70000);

    const calculate = () => {
        if (revenue <= 0) return { margin: 0, profit: 0 };
        const profit = revenue - cost;
        const margin = (profit / revenue) * 100;
        return { margin: margin.toFixed(2), profit: profit.toFixed(2) };
    };

    const result = calculate();

    return (
        <CalculatorCard
            title="Profit Margin"
            icon={DollarSign}
            result={`${result.margin}%`}
            resultLabel={`Net Profit: $${Number(result.profit).toLocaleString()}`}
        >
            <InputField label="Total Revenue" value={revenue} onChange={setRevenue} prefix="$" />
            <InputField label="Total Costs" value={cost} onChange={setCost} prefix="$" />
        </CalculatorCard>
    );
}

function DebtToEquityCalculator() {
    const [totalDebt, setTotalDebt] = useState(500000);
    const [totalEquity, setTotalEquity] = useState(1000000);

    const calculate = () => {
        if (totalEquity <= 0) return { ratio: 'N/A', health: 'N/A' };
        const ratio = totalDebt / totalEquity;
        let health = 'Moderate';
        if (ratio < 0.5) health = 'Low Risk';
        else if (ratio > 2) health = 'High Risk';
        return { ratio: ratio.toFixed(2), health };
    };

    const result = calculate();

    return (
        <CalculatorCard
            title="Debt-to-Equity Ratio"
            icon={Scale}
            result={result.ratio}
            resultLabel={`Financial Health: ${result.health}`}
        >
            <InputField label="Total Debt" value={totalDebt} onChange={setTotalDebt} prefix="$" />
            <InputField label="Total Equity" value={totalEquity} onChange={setTotalEquity} prefix="$" />
        </CalculatorCard>
    );
}

function BreakEvenCalculator() {
    const [fixedCosts, setFixedCosts] = useState(50000);
    const [pricePerUnit, setPricePerUnit] = useState(100);
    const [costPerUnit, setCostPerUnit] = useState(60);

    const calculate = () => {
        const contribution = pricePerUnit - costPerUnit;
        if (contribution <= 0) return { units: 'N/A', revenue: 'N/A' };
        const units = Math.ceil(fixedCosts / contribution);
        const revenue = units * pricePerUnit;
        return { units, revenue: revenue.toFixed(2) };
    };

    const result = calculate();

    return (
        <CalculatorCard
            title="Break-Even Analysis"
            icon={RefreshCw}
            result={`${result.units} units`}
            resultLabel={`Break-Even Revenue: $${Number(result.revenue).toLocaleString()}`}
        >
            <InputField label="Fixed Costs" value={fixedCosts} onChange={setFixedCosts} prefix="$" />
            <InputField label="Price Per Unit" value={pricePerUnit} onChange={setPricePerUnit} prefix="$" />
            <InputField label="Variable Cost Per Unit" value={costPerUnit} onChange={setCostPerUnit} prefix="$" />
        </CalculatorCard>
    );
}

// Main Page Component
export default function FinancialCalculators() {
    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />

            <div className="p-8 relative z-10">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Calculator className="text-indus-500" size={32} />
                        <h1 className="text-3xl font-bold text-white">
                            Financial <span className="gradient-text">Calculators</span>
                        </h1>
                    </div>
                    <p className="text-slate-400">
                        Essential tools for investment analysis and financial decision making
                    </p>
                </motion.div>

                {/* Calculators Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                >
                    <CompoundInterestCalculator />
                    <CAGRCalculator />
                    <ROICalculator />
                    <PERatioCalculator />
                    <EMICalculator />
                    <ProfitMarginCalculator />
                    <DebtToEquityCalculator />
                    <BreakEvenCalculator />
                </motion.div>

                {/* Quick Tips */}
                <motion.div
                    className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-lg font-semibold text-white mb-3">💡 Quick Tips</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                            <ArrowRight size={14} className="text-indus-500 mt-1 flex-shrink-0" />
                            <span>A CAGR of 15%+ annually is considered excellent for long-term investments</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight size={14} className="text-indus-500 mt-1 flex-shrink-0" />
                            <span>P/E ratio between 15-25 is generally considered fair value for most stocks</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight size={14} className="text-indus-500 mt-1 flex-shrink-0" />
                            <span>Debt-to-Equity below 0.5 indicates strong financial health</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight size={14} className="text-indus-500 mt-1 flex-shrink-0" />
                            <span>Profit margins above 20% are typically considered healthy</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
