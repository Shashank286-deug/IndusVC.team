import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import ImpactBadge, { calculateNewsImpact } from './ImpactBadge';
import { fetchMarketNews, isApiConfigured } from '../../lib/geminiService';

const impactIcons = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: Minus
};

const impactColors = {
    positive: 'text-profit bg-profit/10',
    negative: 'text-loss bg-loss/10',
    neutral: 'text-slate-400 bg-slate-700'
};

const categoryColors = {
    Market: 'bg-blue-500/20 text-blue-400',
    Stocks: 'bg-purple-500/20 text-purple-400',
    Economy: 'bg-green-500/20 text-green-400',
    IPO: 'bg-indus-500/20 text-indus-400',
    'FII/DII': 'bg-yellow-500/20 text-yellow-400',
    Regulatory: 'bg-red-500/20 text-red-400'
};

export default function MarketNews() {
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConfigured, setIsConfigured] = useState(false);

    const loadNews = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchMarketNews();
            setNews(data);
            setIsConfigured(isApiConfigured());
        } catch (err) {
            setError('Failed to load news');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNews();
        // Refresh news every 5 minutes
        const interval = setInterval(loadNews, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indus-500/10 rounded-md flex items-center justify-center">
                        <Newspaper className="text-indus-500" size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Market News</h3>
                        <p className="text-xs text-slate-400">
                            {isConfigured ? 'Live updates via Gemini AI' : 'Sample data (Add API key for live)'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={loadNews}
                    disabled={isLoading}
                    className="p-2 hover:bg-slate-800 rounded-md transition-colors"
                >
                    <RefreshCw size={16} className={`text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {!isConfigured && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md flex items-start gap-2">
                    <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-400">
                        Add your Gemini API key to <code className="bg-slate-800 px-1 rounded">.env</code> file for real-time news
                    </p>
                </div>
            )}

            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                <AnimatePresence>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="p-3 bg-slate-800/50 rounded-md animate-pulse">
                                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-slate-700 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-slate-400">
                            <p>{error}</p>
                            <button onClick={loadNews} className="mt-2 text-indus-400 hover:underline">
                                Try again
                            </button>
                        </div>
                    ) : (
                        news.map((item, index) => {
                            const ImpactIcon = impactIcons[item.impact] || Minus;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-md border border-slate-700 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-md ${impactColors[item.impact]}`}>
                                            <ImpactIcon size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="text-sm font-medium text-white line-clamp-2 flex-1">
                                                    {item.headline}
                                                </h4>
                                                <ImpactBadge impact={calculateNewsImpact(item.headline, item.summary)} />
                                            </div>
                                            <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                                                {item.summary}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[item.category] || 'bg-slate-700 text-slate-400'}`}>
                                                    {item.category}
                                                </span>
                                                <span className="text-xs text-slate-500">{item.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
}
