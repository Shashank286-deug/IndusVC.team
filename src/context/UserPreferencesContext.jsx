import { createContext, useContext, useState, useEffect } from 'react';

const UserPreferencesContext = createContext(null);

// Default preferences for new users
const DEFAULT_PREFERENCES = {
    riskTolerance: 'Moderate', // 'Conservative', 'Moderate', 'Aggressive'
    benchmarkIndex: 'NIFTY 50', // 'NIFTY 50', 'S&P 500', 'NASDAQ'
    baseCurrency: 'INR', // 'INR', 'USD'
    isOnboarded: false
};

// Benchmark data mapping
export const BENCHMARK_DATA = {
    'NIFTY 50': { symbol: 'NIFTY', dataKey: 'nifty50', color: '#64748b', currency: '₹' },
    'S&P 500': { symbol: 'SPX', dataKey: 'sp500', color: '#64748b', currency: '$' },
    'NASDAQ': { symbol: 'IXIC', dataKey: 'nasdaq', color: '#64748b', currency: '$' }
};

// Currency configuration
export const CURRENCY_CONFIG = {
    'INR': { symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
    'USD': { symbol: '$', locale: 'en-US', name: 'US Dollar' }
};

// Risk tolerance thresholds for color coding
export const RISK_THRESHOLDS = {
    'Conservative': { low: 3, medium: 5, high: 7 },
    'Moderate': { low: 4, medium: 6, high: 8 },
    'Aggressive': { low: 5, medium: 7, high: 9 }
};

export function UserPreferencesProvider({ children }) {
    const [preferences, setPreferences] = useState(() => {
        // Load from localStorage on init
        const saved = localStorage.getItem('indusvc_user_preferences');
        if (saved) {
            try {
                return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
            } catch {
                return DEFAULT_PREFERENCES;
            }
        }
        return DEFAULT_PREFERENCES;
    });

    const [userName, setUserName] = useState(() => {
        const saved = localStorage.getItem('indusvc_user_name');
        return saved || 'Analyst';
    });

    // Persist preferences to localStorage
    useEffect(() => {
        localStorage.setItem('indusvc_user_preferences', JSON.stringify(preferences));
    }, [preferences]);

    useEffect(() => {
        localStorage.setItem('indusvc_user_name', userName);
    }, [userName]);

    // Update a single preference
    const updatePreference = (key, value) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Update multiple preferences at once
    const updatePreferences = (newPreferences) => {
        setPreferences(prev => ({
            ...prev,
            ...newPreferences
        }));
    };

    // Complete onboarding
    const completeOnboarding = (data) => {
        setPreferences(prev => ({
            ...prev,
            ...data,
            isOnboarded: true
        }));
        if (data.userName) {
            setUserName(data.userName);
        }
    };

    // Reset to defaults
    const resetPreferences = () => {
        setPreferences(DEFAULT_PREFERENCES);
        localStorage.removeItem('indusvc_user_preferences');
    };

    // Get current currency config
    const getCurrencyConfig = () => CURRENCY_CONFIG[preferences.baseCurrency];

    // Get current benchmark config
    const getBenchmarkConfig = () => BENCHMARK_DATA[preferences.benchmarkIndex];

    // Get risk color based on score and tolerance
    const getRiskColor = (score) => {
        const thresholds = RISK_THRESHOLDS[preferences.riskTolerance];
        if (score <= thresholds.low) return 'text-profit';
        if (score <= thresholds.medium) return 'text-yellow-400';
        return 'text-loss';
    };

    const getRiskLabel = (score) => {
        const thresholds = RISK_THRESHOLDS[preferences.riskTolerance];
        if (score <= thresholds.low) return 'Low Risk';
        if (score <= thresholds.medium) return 'Moderate Risk';
        return 'High Risk';
    };

    const value = {
        preferences,
        userName,
        setUserName,
        updatePreference,
        updatePreferences,
        completeOnboarding,
        resetPreferences,
        getCurrencyConfig,
        getBenchmarkConfig,
        getRiskColor,
        getRiskLabel,
        // Convenience getters
        riskTolerance: preferences.riskTolerance,
        benchmarkIndex: preferences.benchmarkIndex,
        baseCurrency: preferences.baseCurrency,
        isOnboarded: preferences.isOnboarded,
        currencySymbol: CURRENCY_CONFIG[preferences.baseCurrency].symbol
    };

    return (
        <UserPreferencesContext.Provider value={value}>
            {children}
        </UserPreferencesContext.Provider>
    );
}

export function useUserPreferences() {
    const context = useContext(UserPreferencesContext);
    if (!context) {
        throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    }
    return context;
}

export default UserPreferencesContext;
