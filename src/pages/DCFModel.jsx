import { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import InputSlider from '../components/dcf/InputSlider';
import ValuationChart from '../components/dcf/ValuationChart';
import SensitivityMatrix from '../components/dcf/SensitivityMatrix';
import ScenarioManager from '../components/dcf/ScenarioManager';
import { calculateDCF } from '../lib/dcfCalculator';
import { dcfDefaults } from '../lib/mockData';
import { Calculator, Info } from 'lucide-react';

// Custom debounce hook
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

export default function DCFModel() {
    const [params, setParams] = useState({
        revenue: dcfDefaults.revenue,
        revenueGrowth: dcfDefaults.revenueGrowth,
        ebitMargin: dcfDefaults.ebitMargin,
        taxRate: dcfDefaults.taxRate,
        wacc: dcfDefaults.wacc,
        terminalGrowth: dcfDefaults.terminalGrowth,
        shares: dcfDefaults.shares,
        currentPrice: dcfDefaults.currentPrice,
    });

    // Debounce params for expensive calculations (300ms)
    const debouncedParams = useDebounce(params, 300);

    const [dcfResult, setDcfResult] = useState(null);

    // Scenario management state
    const [savedScenarios, setSavedScenarios] = useState({
        bear: null,
        base: null,
        bull: null
    });

    // Calculate DCF with debounced params
    useEffect(() => {
        const result = calculateDCF(debouncedParams);
        setDcfResult(result);
    }, [debouncedParams]);

    const updateParam = (key, value) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    // Scenario handlers
    const handleSaveScenario = useCallback((scenarioKey, scenarioParams) => {
        setSavedScenarios(prev => ({
            ...prev,
            [scenarioKey]: scenarioParams
        }));
    }, []);

    const handleLoadScenario = useCallback((scenarioParams) => {
        setParams(scenarioParams);
    }, []);

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                    <Calculator className="text-indus-500" size={32} />
                    DCF <span className="gradient-text">Valuation Model</span>
                </h1>
                <p className="text-slate-400">Discounted Cash Flow analysis with real-time calculation</p>
            </div>

            {/* Info Banner */}
            <div className="bg-indus-500/10 border border-indus-500/20 rounded-md p-4 mb-6 flex items-start gap-3">
                <Info className="text-indus-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-slate-300">
                    <p className="font-medium text-indus-400 mb-1">Interactive Valuation Model</p>
                    <p>Adjust the parameters below to see how they impact the intrinsic value calculation.
                        This model uses a 5-year DCF projection with terminal value.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Controls */}
                <Card glass>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indus-500/10 rounded-md flex items-center justify-center">
                            <Calculator className="text-indus-500" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Model Inputs</h2>
                            <p className="text-xs text-slate-400">Adjust parameters to calculate valuation</p>
                        </div>
                    </div>

                    {/* Scenario Management */}
                    <ScenarioManager
                        currentParams={params}
                        savedScenarios={savedScenarios}
                        onSaveScenario={handleSaveScenario}
                        onLoadScenario={handleLoadScenario}
                    />

                    <div className="space-y-6">
                        <div className="bg-slate-800/50 rounded-md p-4">
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Current Annual Revenue
                            </label>
                            <input
                                type="number"
                                value={params.revenue}
                                onChange={(e) => updateParam('revenue', parseFloat(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                            />
                            <p className="text-xs text-slate-500 mt-1">in millions</p>
                        </div>

                        <InputSlider
                            label="Revenue Growth Rate"
                            value={params.revenueGrowth}
                            onChange={(val) => updateParam('revenueGrowth', val)}
                            min={0}
                            max={50}
                            step={0.5}
                            unit="%"
                        />

                        <InputSlider
                            label="EBIT Margin"
                            value={params.ebitMargin}
                            onChange={(val) => updateParam('ebitMargin', val)}
                            min={0}
                            max={50}
                            step={0.5}
                            unit="%"
                        />

                        <InputSlider
                            label="Tax Rate"
                            value={params.taxRate}
                            onChange={(val) => updateParam('taxRate', val)}
                            min={0}
                            max={40}
                            step={0.5}
                            unit="%"
                        />

                        <InputSlider
                            label="WACC (Discount Rate)"
                            value={params.wacc}
                            onChange={(val) => updateParam('wacc', val)}
                            min={5}
                            max={20}
                            step={0.1}
                            unit="%"
                        />

                        <InputSlider
                            label="Terminal Growth Rate"
                            value={params.terminalGrowth}
                            onChange={(val) => updateParam('terminalGrowth', val)}
                            min={0}
                            max={5}
                            step={0.1}
                            unit="%"
                        />

                        <div className="bg-slate-800/50 rounded-md p-4">
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Shares Outstanding
                            </label>
                            <input
                                type="number"
                                value={params.shares}
                                onChange={(e) => updateParam('shares', parseFloat(e.target.value) || 0)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                            />
                            <p className="text-xs text-slate-500 mt-1">in millions</p>
                        </div>
                    </div>

                    {/* Additional Metrics */}
                    {dcfResult && (
                        <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Enterprise Value</p>
                                <p className="text-lg font-mono font-semibold text-white">
                                    ${dcfResult.enterpriseValue.toLocaleString()}M
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Terminal Value (PV)</p>
                                <p className="text-lg font-mono font-semibold text-white">
                                    ${dcfResult.terminalValue.toLocaleString()}M
                                </p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Valuation Output */}
                {dcfResult && (
                    <ValuationChart
                        intrinsicValue={dcfResult.intrinsicValue}
                        currentPrice={params.currentPrice}
                    />
                )}
            </div>

            {/* Sensitivity Analysis Matrix */}
            {dcfResult && (
                <SensitivityMatrix
                    params={debouncedParams}
                    currentPrice={params.currentPrice}
                />
            )}
        </div>
    );
}
