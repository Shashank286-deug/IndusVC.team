import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription, PLANS } from '../context/SubscriptionContext';
import { Check, X, Zap, Building2, Crown, Sparkles } from 'lucide-react';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const planIcons = {
    free: Zap,
    pro: Crown,
    org: Building2,
    creator: Sparkles
};

const featureLabels = {
    dcfModel: 'DCF Valuation Model',
    sensitivityAnalysis: 'Sensitivity Analysis Matrix',
    scenarioManager: 'Scenario Management',
    portfolioRisk: 'Portfolio Risk Analysis',
    correlationMatrix: 'Holdings Correlation Matrix',
    aiInterrogator: 'AI Interrogator',
    smartPrompts: 'Smart Prompt Chips',
    impactBadges: 'News Impact Badges',
    trendIndicators: 'Trend Indicators'
};

export default function PricingPage() {
    const { user, isAuthenticated, updatePlan } = useAuth();
    const { currentPlan } = useSubscription();
    const navigate = useNavigate();

    const displayPlans = ['free', 'pro', 'org'];

    const handleSelectPlan = (planId) => {
        if (planId === 'org') {
            alert('Contact us at sales@indusvc.team for Organization pricing');
            return;
        }
        updatePlan(planId);
    };

    return (
        <div className="p-8 relative min-h-screen">
            <AnimatedBackground />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Choose Your <span className="gradient-text-animated">Plan</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Unlock powerful financial intelligence tools. Start free and upgrade when you need more.
                    </p>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {displayPlans.map((planId, index) => {
                        const plan = PLANS[planId];
                        const Icon = planIcons[planId];
                        const isCurrent = currentPlan === planId;
                        const isPopular = planId === 'pro';

                        return (
                            <motion.div
                                key={planId}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                whileHover={{
                                    y: -8,
                                    boxShadow: isPopular
                                        ? '0 20px 40px rgba(249, 115, 22, 0.2)'
                                        : '0 20px 40px rgba(0, 0, 0, 0.3)'
                                }}
                                className={`relative rounded-xl p-6 transition-colors ${isPopular
                                        ? 'bg-gradient-to-b from-indus-500/20 to-slate-900 border-2 border-indus-500'
                                        : 'bg-slate-900 border border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                {/* Popular Badge */}
                                {isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indus-500 text-white text-xs font-semibold rounded-full">
                                        Most Popular
                                    </div>
                                )}

                                {/* Current Plan Badge */}
                                {isCurrent && (
                                    <div className="absolute -top-3 right-4 px-3 py-1 bg-profit text-white text-xs font-semibold rounded-full">
                                        Current Plan
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isPopular ? 'bg-indus-500/20' : 'bg-slate-800'
                                        }`}>
                                        <Icon className={isPopular ? 'text-indus-400' : 'text-slate-400'} size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                        <p className="text-xs text-slate-400">{plan.description}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-bold text-white">
                                            {plan.price === 0 ? 'Free' : plan.price === null ? 'Custom' : `$${plan.price}`}
                                        </span>
                                        {plan.price > 0 && (
                                            <span className="text-slate-400 mb-1">/month</span>
                                        )}
                                    </div>
                                    {planId === 'pro' && (
                                        <p className="text-xs text-indus-400 mt-1">2,500 AI tokens included</p>
                                    )}
                                    {planId === 'org' && (
                                        <p className="text-xs text-indus-400 mt-1">Unlimited AI tokens</p>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-6">
                                    {Object.entries(featureLabels).map(([key, label]) => {
                                        const hasFeature = plan.features[key];
                                        return (
                                            <li key={key} className="flex items-center gap-2">
                                                {hasFeature ? (
                                                    <Check size={16} className="text-profit flex-shrink-0" />
                                                ) : (
                                                    <X size={16} className="text-slate-600 flex-shrink-0" />
                                                )}
                                                <span className={hasFeature ? 'text-slate-300' : 'text-slate-600'}>
                                                    {label}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleSelectPlan(planId)}
                                    disabled={isCurrent}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all ${isCurrent
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : isPopular
                                            ? 'bg-indus-500 text-white hover:bg-indus-600'
                                            : 'bg-slate-800 text-white hover:bg-slate-700'
                                        }`}
                                >
                                    {isCurrent ? 'Current Plan' : planId === 'org' ? 'Contact Sales' : `Get ${plan.name}`}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* FAQ or Additional Info */}
                <div className="text-center text-slate-400 text-sm">
                    <p>All plans include access to basic features. Upgrade anytime to unlock more.</p>
                    <p className="mt-2">
                        Questions? Contact us at <a href="mailto:support@indusvc.team" className="text-indus-400 hover:underline">support@indusvc.team</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
