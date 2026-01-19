import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, TrendingDown, Minus, TrendingUp, Check } from 'lucide-react';

const scenarios = [
    {
        key: 'bear',
        label: 'Bear Case',
        icon: TrendingDown,
        color: 'loss',
        bgColor: 'bg-loss/10 hover:bg-loss/20 border-loss/30',
        activeColor: 'bg-loss/30 border-loss'
    },
    {
        key: 'base',
        label: 'Base Case',
        icon: Minus,
        color: 'slate-400',
        bgColor: 'bg-slate-700/50 hover:bg-slate-700 border-slate-600',
        activeColor: 'bg-slate-600 border-slate-400'
    },
    {
        key: 'bull',
        label: 'Bull Case',
        icon: TrendingUp,
        color: 'profit',
        bgColor: 'bg-profit/10 hover:bg-profit/20 border-profit/30',
        activeColor: 'bg-profit/30 border-profit'
    }
];

export default function ScenarioManager({ currentParams, onLoadScenario, savedScenarios, onSaveScenario }) {
    const [activeScenario, setActiveScenario] = useState(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(null);

    const handleSave = (scenarioKey) => {
        onSaveScenario(scenarioKey, { ...currentParams });
        setShowSaveConfirm(scenarioKey);
        setTimeout(() => setShowSaveConfirm(null), 1500);
    };

    const handleLoad = (scenarioKey) => {
        if (savedScenarios[scenarioKey]) {
            onLoadScenario(savedScenarios[scenarioKey]);
            setActiveScenario(scenarioKey);
        }
    };

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
                <Save size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Scenario Management</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {scenarios.map((scenario) => {
                    const Icon = scenario.icon;
                    const isSaved = !!savedScenarios[scenario.key];
                    const isActive = activeScenario === scenario.key;
                    const isConfirming = showSaveConfirm === scenario.key;

                    return (
                        <div key={scenario.key} className="flex flex-col gap-2">
                            {/* Load Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleLoad(scenario.key)}
                                disabled={!isSaved}
                                className={`
                                    relative p-3 rounded-md border transition-all
                                    flex items-center justify-center gap-2
                                    ${isSaved
                                        ? (isActive ? scenario.activeColor : scenario.bgColor)
                                        : 'bg-slate-800/30 border-slate-800 opacity-50 cursor-not-allowed'
                                    }
                                `}
                            >
                                <Icon size={16} className={`text-${scenario.color}`} />
                                <span className={`text-sm font-medium text-${scenario.color}`}>
                                    {scenario.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-indus-500 rounded-full flex items-center justify-center"
                                    >
                                        <Check size={10} className="text-white" />
                                    </motion.div>
                                )}
                            </motion.button>

                            {/* Save Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSave(scenario.key)}
                                className={`
                                    px-2 py-1.5 rounded-md text-xs font-medium
                                    transition-all flex items-center justify-center gap-1
                                    ${isConfirming
                                        ? 'bg-profit/20 text-profit border border-profit/30'
                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 border border-slate-700'
                                    }
                                `}
                            >
                                {isConfirming ? (
                                    <>
                                        <Check size={12} />
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        <Save size={12} />
                                        {isSaved ? 'Update' : 'Save Current'}
                                    </>
                                )}
                            </motion.button>
                        </div>
                    );
                })}
            </div>

            {/* Info text */}
            <p className="text-xs text-slate-500 mt-3">
                Save your current slider configuration as a scenario, then click to quickly toggle between cases.
            </p>
        </div>
    );
}
