import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext(null);

// Plan configurations
export const PLANS = {
    free: {
        id: 'free',
        name: 'Free',
        price: 0,
        priceLabel: '$0',
        tokensLimit: 0,
        features: {
            dcfModel: true,
            sensitivityAnalysis: true,
            scenarioManager: true,
            portfolioRisk: false,
            correlationMatrix: false,
            aiInterrogator: false,
            smartPrompts: false,
            impactBadges: false,
            trendIndicators: false
        },
        description: 'Basic valuation tools'
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 20,
        priceLabel: '$20/mo',
        tokensLimit: 2500,
        features: {
            dcfModel: true,
            sensitivityAnalysis: true,
            scenarioManager: true,
            portfolioRisk: true,
            correlationMatrix: true,
            aiInterrogator: true,
            smartPrompts: true,
            impactBadges: true,
            trendIndicators: true
        },
        description: 'Full access for professionals'
    },
    org: {
        id: 'org',
        name: 'Organization',
        price: null,
        priceLabel: 'Custom',
        tokensLimit: Infinity,
        features: {
            dcfModel: true,
            sensitivityAnalysis: true,
            scenarioManager: true,
            portfolioRisk: true,
            correlationMatrix: true,
            aiInterrogator: true,
            smartPrompts: true,
            impactBadges: true,
            trendIndicators: true
        },
        description: 'Unlimited access for teams'
    },
    creator: {
        id: 'creator',
        name: 'Creator',
        price: null,
        priceLabel: 'Dev Access',
        tokensLimit: Infinity,
        features: {
            dcfModel: true,
            sensitivityAnalysis: true,
            scenarioManager: true,
            portfolioRisk: true,
            correlationMatrix: true,
            aiInterrogator: true,
            smartPrompts: true,
            impactBadges: true,
            trendIndicators: true
        },
        description: 'Full development access'
    }
};

export function SubscriptionProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [tokensUsed, setTokensUsed] = useState(0);
    const [subscriptionData, setSubscriptionData] = useState(null);

    // Get current plan from user
    const currentPlan = user?.plan || 'free';
    const planConfig = PLANS[currentPlan] || PLANS.free;

    // Load token usage from localStorage
    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem(`indusvc_tokens_${user.email}`);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    // Reset if it's a new month
                    const storedMonth = new Date(data.lastReset).getMonth();
                    const currentMonth = new Date().getMonth();
                    if (storedMonth !== currentMonth) {
                        setTokensUsed(0);
                        saveTokens(0);
                    } else {
                        setTokensUsed(data.used || 0);
                    }
                } catch (e) {
                    setTokensUsed(0);
                }
            }
        }
    }, [user]);

    const saveTokens = (used) => {
        if (user) {
            localStorage.setItem(`indusvc_tokens_${user.email}`, JSON.stringify({
                used,
                lastReset: new Date().toISOString()
            }));
        }
    };

    // Use tokens for AI calls
    const useTokens = (amount = 1) => {
        if (!canUseAI()) return false;

        const newUsed = tokensUsed + amount;
        setTokensUsed(newUsed);
        saveTokens(newUsed);
        return true;
    };

    // Check if user can use AI
    const canUseAI = () => {
        if (!isAuthenticated) return false;
        if (currentPlan === 'creator' || currentPlan === 'org') return true;
        if (currentPlan === 'free') return false;
        return tokensUsed < planConfig.tokensLimit;
    };

    // Check if a specific feature is available
    const hasFeature = (featureName) => {
        if (!isAuthenticated) return false;
        return planConfig.features[featureName] || false;
    };

    // Get remaining tokens
    const tokensRemaining = () => {
        if (planConfig.tokensLimit === Infinity) return Infinity;
        return Math.max(0, planConfig.tokensLimit - tokensUsed);
    };

    // Get usage percentage
    const usagePercentage = () => {
        if (planConfig.tokensLimit === Infinity || planConfig.tokensLimit === 0) return 0;
        return Math.min(100, (tokensUsed / planConfig.tokensLimit) * 100);
    };

    const value = {
        currentPlan,
        planConfig,
        plans: PLANS,
        tokensUsed,
        tokensLimit: planConfig.tokensLimit,
        tokensRemaining: tokensRemaining(),
        usagePercentage: usagePercentage(),
        useTokens,
        canUseAI: canUseAI(),
        hasFeature,
        isUnlimited: planConfig.tokensLimit === Infinity
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}

export default SubscriptionContext;
