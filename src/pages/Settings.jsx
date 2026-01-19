import { useState, useEffect } from 'react';
import { User, Bell, Lock, Palette, Wrench, LayoutDashboard, Brain, Calculator, ShieldAlert, Save, RotateCcw, Target, TrendingUp, DollarSign, Shield, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useUserPreferences, CURRENCY_CONFIG, BENCHMARK_DATA, RISK_THRESHOLDS } from '../context/UserPreferencesContext';

// Tool configuration data
const toolsConfig = [
    {
        id: 'dashboard',
        name: 'Command Center',
        description: 'Real-time portfolio overview and market insights',
        icon: LayoutDashboard,
        defaultEnabled: true
    },
    {
        id: 'interrogator',
        name: 'AI Interrogator',
        description: 'Ask questions about financial documents using AI',
        icon: Brain,
        defaultEnabled: true
    },
    {
        id: 'dcf',
        name: 'DCF Model (Crystal Ball)',
        description: 'Interactive discounted cash flow valuation calculator',
        icon: Calculator,
        defaultEnabled: true
    },
    {
        id: 'risk',
        name: 'Portfolio Risk Analyzer',
        description: 'Analyze sector allocation and identify risk concentrations',
        icon: ShieldAlert,
        defaultEnabled: true
    },
];

const RISK_OPTIONS = [
    { value: 'Conservative', label: 'Conservative', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500' },
    { value: 'Moderate', label: 'Moderate', icon: Target, color: 'text-yellow-400', bg: 'bg-yellow-500' },
    { value: 'Aggressive', label: 'Aggressive', icon: TrendingUp, color: 'text-red-400', bg: 'bg-red-500' }
];

export default function Settings() {
    const {
        userName,
        setUserName,
        preferences,
        updatePreference,
        riskTolerance,
        benchmarkIndex,
        baseCurrency
    } = useUserPreferences();

    // Profile state - sync with context
    const [profile, setProfile] = useState({
        name: userName || 'Senior Analyst',
        email: 'analyst@indusvc.com',
        role: 'Senior Portfolio Manager',
        organization: 'IndusVC Capital'
    });

    // Sync profile name with context
    useEffect(() => {
        if (profile.name !== userName) {
            setUserName(profile.name);
        }
    }, [profile.name]);

    // Tool preferences state
    const [toolPreferences, setToolPreferences] = useState(
        toolsConfig.reduce((acc, tool) => ({
            ...acc,
            [tool.id]: { enabled: tool.defaultEnabled, priority: 'normal' }
        }), {})
    );

    // Notification preferences
    const [notifications, setNotifications] = useState({
        portfolioAlerts: true,
        marketUpdates: true,
        riskWarnings: true,
        aiInsights: false
    });

    const handleToolToggle = (toolId) => {
        setToolPreferences(prev => ({
            ...prev,
            [toolId]: { ...prev[toolId], enabled: !prev[toolId].enabled }
        }));
    };

    const handleToolPriority = (toolId, priority) => {
        setToolPreferences(prev => ({
            ...prev,
            [toolId]: { ...prev[toolId], priority }
        }));
    };

    const handleSave = () => {
        // Save all preferences
        setUserName(profile.name);
        console.log('Saving preferences:', { profile, toolPreferences, notifications, preferences });
        alert('Preferences saved successfully!');
    };

    const handleReset = () => {
        setToolPreferences(
            toolsConfig.reduce((acc, tool) => ({
                ...acc,
                [tool.id]: { enabled: tool.defaultEnabled, priority: 'normal' }
            }), {})
        );
    };

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
                <p className="text-slate-400">Manage your account, tools, and preferences</p>
            </div>

            <div className="max-w-4xl space-y-6">
                {/* Profile Settings */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <User className="text-indus-500" size={24} />
                        <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Role</label>
                            <input
                                type="text"
                                value={profile.role}
                                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">Organization</label>
                            <input
                                type="text"
                                value={profile.organization}
                                onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                            />
                        </div>
                    </div>
                </Card>

                {/* Investment Mandate - NEW SECTION */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="text-indus-500" size={24} />
                        <div>
                            <h2 className="text-xl font-bold text-white">Investment Mandate</h2>
                            <p className="text-sm text-slate-400">Configure your default analysis settings</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Risk Appetite - Segmented Control */}
                        <div>
                            <label className="text-sm font-medium text-slate-300 mb-3 block">Risk Appetite</label>
                            <div className="flex gap-2 p-1 bg-slate-800 rounded-lg">
                                {RISK_OPTIONS.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = riskTolerance === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => updatePreference('riskTolerance', option.value)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium transition-all ${isSelected
                                                    ? `${option.bg} text-white shadow-lg`
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                                }`}
                                        >
                                            <Icon size={16} />
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                {riskTolerance === 'Conservative' && 'Risk scores above 5 will be flagged as concerning'}
                                {riskTolerance === 'Moderate' && 'Risk scores above 6 will be flagged as concerning'}
                                {riskTolerance === 'Aggressive' && 'Risk scores above 7 will be flagged as concerning'}
                            </p>
                        </div>

                        {/* Benchmark & Currency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">
                                    Primary Benchmark Index
                                </label>
                                <select
                                    value={benchmarkIndex}
                                    onChange={(e) => updatePreference('benchmarkIndex', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                                >
                                    {Object.keys(BENCHMARK_DATA).map((benchmark) => (
                                        <option key={benchmark} value={benchmark}>{benchmark}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">
                                    Used for portfolio performance comparison
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">
                                    Reporting Currency
                                </label>
                                <select
                                    value={baseCurrency}
                                    onChange={(e) => updatePreference('baseCurrency', e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                                >
                                    {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                                        <option key={code} value={code}>
                                            {config.symbol} {config.name} ({code})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">
                                    All values will be displayed in this currency
                                </p>
                            </div>
                        </div>

                        {/* Current Config Summary */}
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <p className="text-sm text-slate-400">
                                <span className="text-white font-medium">Current Configuration:</span>{' '}
                                {riskTolerance} risk profile • {benchmarkIndex} benchmark • {CURRENCY_CONFIG[baseCurrency].symbol} {baseCurrency}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Tool Preferences */}
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Wrench className="text-indus-500" size={24} />
                            <div>
                                <h2 className="text-xl font-bold text-white">Tool Preferences</h2>
                                <p className="text-sm text-slate-400">Customize which tools are available in your workspace</p>
                            </div>
                        </div>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            <RotateCcw size={16} />
                            Reset to defaults
                        </button>
                    </div>

                    <div className="space-y-4">
                        {toolsConfig.map((tool, index) => {
                            const Icon = tool.icon;
                            const isEnabled = toolPreferences[tool.id]?.enabled;
                            const priority = toolPreferences[tool.id]?.priority || 'normal';

                            return (
                                <motion.div
                                    key={tool.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-4 rounded-md border transition-all duration-200 ${isEnabled
                                        ? 'bg-slate-800/50 border-slate-700'
                                        : 'bg-slate-900/50 border-slate-800 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-md ${isEnabled ? 'bg-indus-500/20' : 'bg-slate-800'}`}>
                                                <Icon size={20} className={isEnabled ? 'text-indus-500' : 'text-slate-500'} />
                                            </div>
                                            <div>
                                                <h3 className={`font-medium ${isEnabled ? 'text-white' : 'text-slate-400'}`}>
                                                    {tool.name}
                                                </h3>
                                                <p className="text-sm text-slate-500">{tool.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {isEnabled && (
                                                <select
                                                    value={priority}
                                                    onChange={(e) => handleToolPriority(tool.id, e.target.value)}
                                                    className="bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                                                >
                                                    <option value="high">High Priority</option>
                                                    <option value="normal">Normal</option>
                                                    <option value="low">Low Priority</option>
                                                </select>
                                            )}

                                            <button
                                                onClick={() => handleToolToggle(tool.id)}
                                                className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${isEnabled ? 'bg-indus-500' : 'bg-slate-700'
                                                    }`}
                                            >
                                                <motion.div
                                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                                    animate={{ left: isEnabled ? '26px' : '4px' }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </Card>

                {/* Notifications */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="text-indus-500" size={24} />
                        <h2 className="text-xl font-bold text-white">Notifications</h2>
                    </div>
                    <div className="space-y-3">
                        {[
                            { key: 'portfolioAlerts', label: 'Portfolio alerts', desc: 'Get notified about significant portfolio changes' },
                            { key: 'marketUpdates', label: 'Market updates', desc: 'Daily market summaries and breaking news' },
                            { key: 'riskWarnings', label: 'Risk warnings', desc: 'Alerts when risk thresholds are exceeded' },
                            { key: 'aiInsights', label: 'AI-generated insights', desc: 'Automated analysis and recommendations' },
                        ].map((item) => (
                            <label
                                key={item.key}
                                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-md cursor-pointer hover:bg-slate-800 transition-colors"
                            >
                                <div>
                                    <span className="text-slate-300 text-sm block">{item.label}</span>
                                    <span className="text-xs text-slate-500">{item.desc}</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={notifications[item.key]}
                                    onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                                    className="w-4 h-4 rounded border-slate-600 text-indus-500 focus:ring-indus-500"
                                />
                            </label>
                        ))}
                    </div>
                </Card>

                {/* Appearance */}
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <Palette className="text-indus-500" size={24} />
                        <h2 className="text-xl font-bold text-white">Appearance</h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-300 font-medium">Dark Mode</p>
                            <p className="text-sm text-slate-500">Currently active (Institutional theme)</p>
                        </div>
                        <div className="w-12 h-6 bg-indus-500 rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button variant="primary" icon={Save} onClick={handleSave}>Save Changes</Button>
                    <Button variant="secondary">Cancel</Button>
                </div>
            </div>
        </div>
    );
}

