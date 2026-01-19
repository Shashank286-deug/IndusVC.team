import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Key } from 'lucide-react';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [creatorCode, setCreatorCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCreatorField, setShowCreatorField] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(email, password, creatorCode);
            } else {
                result = await signup(email, password, name);
            }

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Authentication failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indus-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indus-600/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Indus<span className="gradient-text">VC</span>
                    </h1>
                    <p className="text-slate-400">Financial Intelligence Platform</p>
                </div>

                {/* Card */}
                <div className="glass-card p-8">
                    {/* Toggle */}
                    <div className="flex bg-slate-800 rounded-md p-1 mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin ? 'bg-indus-500 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin ? 'bg-indus-500 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full Name"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indus-500/50 focus:border-indus-500"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indus-500/50 focus:border-indus-500"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indus-500/50 focus:border-indus-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Creator Access Toggle */}
                        {isLogin && (
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setShowCreatorField(!showCreatorField)}
                                    className="text-xs text-slate-500 hover:text-indus-400 flex items-center gap-1"
                                >
                                    <Key size={12} />
                                    {showCreatorField ? 'Hide' : 'Developer Access'}
                                </button>

                                {showCreatorField && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-2"
                                    >
                                        <div className="relative">
                                            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-indus-400" size={18} />
                                            <input
                                                type="password"
                                                value={creatorCode}
                                                onChange={(e) => setCreatorCode(e.target.value)}
                                                placeholder="Creator Access Code"
                                                className="w-full bg-indus-500/10 border border-indus-500/30 rounded-md pl-10 pr-4 py-3 text-white placeholder-indus-400/50 focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-loss/10 border border-loss/30 rounded-md text-loss text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indus-500 to-indus-600 text-white font-semibold py-3 rounded-md hover:from-indus-600 hover:to-indus-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-700"></div>
                        <span className="text-xs text-slate-500">OR</span>
                        <div className="flex-1 h-px bg-slate-700"></div>
                    </div>

                    {/* Demo Access */}
                    <button
                        onClick={() => {
                            setEmail('demo@example.com');
                            setPassword('demo123');
                        }}
                        className="w-full border border-slate-700 text-slate-300 font-medium py-3 rounded-md hover:bg-slate-800 transition-all"
                    >
                        Try Demo Account
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-500 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </motion.div>
        </div>
    );
}
