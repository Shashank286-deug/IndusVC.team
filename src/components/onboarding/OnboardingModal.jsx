import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Check,
    Target,
    TrendingUp,
    DollarSign,
    Briefcase,
    Shield
} from 'lucide-react';
import { useUserPreferences, CURRENCY_CONFIG, BENCHMARK_DATA } from '../../context/UserPreferencesContext';

const STEPS = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'preferences', title: 'Investment Mandate' },
    { id: 'complete', title: 'Ready' }
];

const RISK_OPTIONS = [
    {
        value: 'Conservative',
        label: 'Conservative',
        description: 'Prioritize capital preservation with lower volatility',
        icon: Shield,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/30'
    },
    {
        value: 'Moderate',
        label: 'Moderate',
        description: 'Balance between growth and stability',
        icon: Target,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10 border-yellow-500/30'
    },
    {
        value: 'Aggressive',
        label: 'Aggressive',
        description: 'Maximize growth potential, accept higher volatility',
        icon: TrendingUp,
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30'
    }
];

export default function OnboardingModal({ isOpen, onClose }) {
    const { completeOnboarding, userName, setUserName } = useUserPreferences();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        userName: userName || '',
        riskTolerance: 'Moderate',
        benchmarkIndex: 'NIFTY 50',
        baseCurrency: 'INR'
    });
    const [errors, setErrors] = useState({});

    const validateStep = () => {
        const newErrors = {};
        if (currentStep === 0 && !formData.userName.trim()) {
            newErrors.userName = 'Please enter your name';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < STEPS.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        completeOnboarding({
            userName: formData.userName,
            riskTolerance: formData.riskTolerance,
            benchmarkIndex: formData.benchmarkIndex,
            baseCurrency: formData.baseCurrency
        });
        onClose();
    };

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
                    onClick={() => { }} // Prevent closing on backdrop click during onboarding
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indus-500 to-indus-400"
                            initial={{ width: '0%' }}
                            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Welcome */}
                            {currentStep === 0 && (
                                <motion.div
                                    key="welcome"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <motion.div
                                            className="w-16 h-16 bg-indus-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Sparkles className="text-indus-400" size={32} />
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            Welcome to IndusVC
                                        </h2>
                                        <p className="text-slate-400">
                                            Let's personalize your workspace for the best experience
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            What should we call you?
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.userName}
                                            onChange={(e) => updateFormData('userName', e.target.value)}
                                            placeholder="Enter your name"
                                            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indus-500/50 ${errors.userName ? 'border-red-500' : 'border-slate-700'
                                                }`}
                                        />
                                        {errors.userName && (
                                            <p className="text-red-400 text-sm mt-1">{errors.userName}</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Preferences */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="preferences"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-6">
                                        <Briefcase className="text-indus-400 mx-auto mb-3" size={32} />
                                        <h2 className="text-xl font-bold text-white">
                                            Investment Mandate
                                        </h2>
                                        <p className="text-slate-400 text-sm">
                                            Configure your default analysis settings
                                        </p>
                                    </div>

                                    {/* Risk Tolerance */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-3">
                                            Risk Appetite
                                        </label>
                                        <div className="space-y-2">
                                            {RISK_OPTIONS.map((option) => {
                                                const Icon = option.icon;
                                                const isSelected = formData.riskTolerance === option.value;
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => updateFormData('riskTolerance', option.value)}
                                                        className={`w-full flex items-center gap-4 p-3 rounded-lg border transition-all ${isSelected
                                                                ? option.bg
                                                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                                            }`}
                                                    >
                                                        <div className={`p-2 rounded-lg ${isSelected ? option.bg : 'bg-slate-700'}`}>
                                                            <Icon size={20} className={isSelected ? option.color : 'text-slate-400'} />
                                                        </div>
                                                        <div className="text-left flex-1">
                                                            <p className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                                                {option.label}
                                                            </p>
                                                            <p className="text-xs text-slate-500">{option.description}</p>
                                                        </div>
                                                        {isSelected && (
                                                            <Check className={option.color} size={20} />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Benchmark & Currency Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Benchmark Index
                                            </label>
                                            <select
                                                value={formData.benchmarkIndex}
                                                onChange={(e) => updateFormData('benchmarkIndex', e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                                            >
                                                {Object.keys(BENCHMARK_DATA).map((benchmark) => (
                                                    <option key={benchmark} value={benchmark}>{benchmark}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Reporting Currency
                                            </label>
                                            <select
                                                value={formData.baseCurrency}
                                                onChange={(e) => updateFormData('baseCurrency', e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                                            >
                                                {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                                                    <option key={code} value={code}>
                                                        {config.symbol} {code}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Complete */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="complete"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center space-y-6"
                                >
                                    <motion.div
                                        className="w-20 h-20 bg-profit/20 rounded-full flex items-center justify-center mx-auto"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                    >
                                        <Check className="text-profit" size={40} />
                                    </motion.div>

                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            You're All Set, {formData.userName}!
                                        </h2>
                                        <p className="text-slate-400">
                                            Your workspace is configured and ready to go
                                        </p>
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-slate-800/50 rounded-lg p-4 text-left space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">Risk Appetite</span>
                                            <span className="text-white font-medium">{formData.riskTolerance}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">Benchmark</span>
                                            <span className="text-white font-medium">{formData.benchmarkIndex}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">Currency</span>
                                            <span className="text-white font-medium">
                                                {CURRENCY_CONFIG[formData.baseCurrency].symbol} {formData.baseCurrency}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-500">
                                        You can change these settings anytime from the Settings page
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentStep === 0
                                        ? 'text-slate-600 cursor-not-allowed'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>

                            {currentStep < STEPS.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-indus-500 hover:bg-indus-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Continue
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleComplete}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-profit hover:bg-profit/80 text-white font-medium rounded-lg transition-colors"
                                >
                                    <Sparkles size={18} />
                                    Start Exploring
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
