import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, ChevronDown, Globe, Search, Check, X, Clock, Loader2 } from 'lucide-react';
import { GLOBAL_MARKETS, fetchGlobalMarketData, getMarketStatus, getDefaultMarkets } from '../../lib/globalMarketService';

export default function MarketTicker() {
    const [selectedMarkets, setSelectedMarkets] = useState(() => getDefaultMarkets());
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [marketData, setMarketData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRegions, setExpandedRegions] = useState(['southAsia', 'americas']);
    const [error, setError] = useState(null);

    // Fetch market data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchGlobalMarketData(selectedMarkets);
            setMarketData(data);
            setLastUpdate(new Date());
        } catch (err) {
            console.error('Failed to fetch market data:', err);
            setError('Failed to load market data');
        } finally {
            setIsLoading(false);
        }
    }, [selectedMarkets]);

    // Initial fetch and auto-refresh
    useEffect(() => {
        fetchData();

        // Auto refresh every 30 seconds
        const interval = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchData]);

    // Filter markets based on search
    const filteredMarkets = useMemo(() => {
        const result = {};
        Object.entries(GLOBAL_MARKETS).forEach(([regionKey, region]) => {
            const filtered = region.markets.filter(market =>
                market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                market.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                market.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (filtered.length > 0) {
                result[regionKey] = { ...region, markets: filtered };
            }
        });
        return result;
    }, [searchQuery]);

    const toggleMarket = (marketId) => {
        setSelectedMarkets(prev => {
            if (prev.includes(marketId)) {
                if (prev.length > 1) {
                    return prev.filter(id => id !== marketId);
                }
                return prev;
            }
            return [...prev, marketId];
        });
    };

    const toggleRegion = (regionKey) => {
        setExpandedRegions(prev =>
            prev.includes(regionKey)
                ? prev.filter(r => r !== regionKey)
                : [...prev, regionKey]
        );
    };

    const selectAllInRegion = (regionKey) => {
        const region = GLOBAL_MARKETS[regionKey];
        if (!region) return;

        const regionMarketIds = region.markets.map(m => m.id);
        const allSelected = regionMarketIds.every(id => selectedMarkets.includes(id));

        if (allSelected) {
            // Deselect all in region (keep at least one market total)
            const remaining = selectedMarkets.filter(id => !regionMarketIds.includes(id));
            if (remaining.length > 0) {
                setSelectedMarkets(remaining);
            }
        } else {
            // Select all in region
            setSelectedMarkets(prev => [...new Set([...prev, ...regionMarketIds])]);
        }
    };

    const handleRefresh = () => {
        fetchData();
    };

    // Count selected markets per region
    const getRegionSelectedCount = (regionKey) => {
        const region = GLOBAL_MARKETS[regionKey];
        if (!region) return { selected: 0, total: 0 };
        const selected = region.markets.filter(m => selectedMarkets.includes(m.id)).length;
        return { selected, total: region.markets.length };
    };

    return (
        <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 py-2 overflow-hidden">
            <div className="flex items-center">
                {/* Market Filter */}
                <div className="relative px-3 border-r border-slate-700">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                    >
                        <Globe size={14} className="text-indus-400" />
                        <span className="text-xs text-white font-medium">Markets</span>
                        <span className="text-xs text-indus-400 bg-indus-500/20 px-1.5 py-0.5 rounded">
                            {selectedMarkets.length}
                        </span>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute top-full left-3 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 w-[360px] max-h-[480px] overflow-hidden"
                            >
                                {/* Header with Search */}
                                <div className="p-3 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                            <Globe size={16} className="text-indus-400" />
                                            Global Markets
                                        </h3>
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="p-1 hover:bg-slate-700 rounded"
                                        >
                                            <X size={14} className="text-slate-400" />
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search markets..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indus-500"
                                        />
                                    </div>
                                </div>

                                {/* Markets List */}
                                <div className="overflow-y-auto max-h-[380px] custom-scrollbar">
                                    {Object.entries(filteredMarkets).map(([regionKey, region]) => {
                                        const { selected, total } = getRegionSelectedCount(regionKey);
                                        const isExpanded = expandedRegions.includes(regionKey);

                                        return (
                                            <div key={regionKey} className="border-b border-slate-700/50 last:border-0">
                                                {/* Region Header */}
                                                <button
                                                    onClick={() => toggleRegion(regionKey)}
                                                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-700/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{region.icon}</span>
                                                        <span className="text-sm font-medium text-white">{region.name}</span>
                                                        <span className="text-xs text-slate-400">
                                                            ({selected}/{total})
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                selectAllInRegion(regionKey);
                                                            }}
                                                            className="text-xs text-indus-400 hover:text-indus-300 px-2 py-0.5 rounded hover:bg-indus-500/20"
                                                        >
                                                            {selected === total ? 'Clear' : 'All'}
                                                        </button>
                                                        <ChevronDown
                                                            size={14}
                                                            className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                        />
                                                    </div>
                                                </button>

                                                {/* Markets in Region */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden bg-slate-900/50"
                                                        >
                                                            {region.markets.map(market => {
                                                                const status = getMarketStatus(market);
                                                                const isSelected = selectedMarkets.includes(market.id);

                                                                return (
                                                                    <button
                                                                        key={market.id}
                                                                        onClick={() => toggleMarket(market.id)}
                                                                        className={`w-full flex items-center gap-2 px-4 py-2 text-left transition-colors ${isSelected
                                                                                ? 'bg-indus-500/10 border-l-2 border-indus-500'
                                                                                : 'hover:bg-slate-700/50 border-l-2 border-transparent'
                                                                            }`}
                                                                    >
                                                                        <span className="text-base">{market.flag}</span>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-sm text-white truncate">{market.name}</span>
                                                                                <span className="text-xs text-slate-500">{market.symbol}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-xs text-slate-400">{market.country}</span>
                                                                                <span className={`text-xs ${status.color}`}>
                                                                                    • {status.label}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        {isSelected && (
                                                                            <motion.div
                                                                                initial={{ scale: 0 }}
                                                                                animate={{ scale: 1 }}
                                                                                className="w-5 h-5 bg-indus-500 rounded-full flex items-center justify-center"
                                                                            >
                                                                                <Check size={12} className="text-white" />
                                                                            </motion.div>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Footer */}
                                <div className="p-2 border-t border-slate-700 bg-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-400">
                                        {selectedMarkets.length} markets selected
                                    </span>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="px-3 py-1 bg-indus-500 hover:bg-indus-600 text-white text-xs rounded-md transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 px-3 border-r border-slate-700">
                    {isLoading ? (
                        <>
                            <Loader2 size={12} className="text-indus-400 animate-spin" />
                            <span className="text-xs text-slate-400">Loading...</span>
                        </>
                    ) : (
                        <>
                            <div className="w-2 h-2 rounded-full bg-profit animate-pulse"></div>
                            <span className="text-xs text-slate-400">LIVE</span>
                        </>
                    )}
                </div>

                {/* Scrolling Ticker */}
                <div className="flex-1 overflow-hidden">
                    {isLoading && marketData.length === 0 ? (
                        <div className="flex items-center gap-6 px-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center gap-3 animate-pulse">
                                    <div className="w-16 h-4 bg-slate-700 rounded"></div>
                                    <div className="w-12 h-4 bg-slate-700 rounded"></div>
                                    <div className="w-10 h-3 bg-slate-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : marketData.length > 0 ? (
                        <motion.div
                            className="flex items-center gap-6 whitespace-nowrap"
                            animate={{ x: ['0%', '-50%'] }}
                            transition={{
                                duration: Math.max(25, marketData.length * 4),
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                        >
                            {/* Duplicate for seamless loop */}
                            {[...marketData, ...marketData].map((item, index) => (
                                <div
                                    key={`${item.symbol}-${index}`}
                                    className="flex items-center gap-3 px-3 group cursor-pointer"
                                >
                                    <span className="text-sm">{item.flag}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-semibold text-white group-hover:text-indus-400 transition-colors">
                                            {item.name}
                                        </span>
                                        <span className="text-xs text-slate-500">{item.symbol}</span>
                                        {item.status && (
                                            <div className={`w-1.5 h-1.5 rounded-full ${item.status.status === 'open' ? 'bg-emerald-400' :
                                                    item.status.status === 'pre-market' || item.status.status === 'after-hours' ? 'bg-amber-400' :
                                                        'bg-red-400'
                                                }`}></div>
                                        )}
                                    </div>
                                    <span className="text-sm font-mono text-white">
                                        {item.currency}{item.price?.toLocaleString('en-US', {
                                            maximumFractionDigits: item.price < 10 ? 4 : item.price < 1000 ? 2 : 0
                                        })}
                                    </span>
                                    <div className={`flex items-center gap-1 ${item.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                                        {item.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        <span className="text-xs font-mono">
                                            {item.change >= 0 ? '+' : ''}{item.changePercent?.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex items-center justify-center px-4 text-slate-400 text-sm">
                            {error || 'No markets selected'}
                        </div>
                    )}
                </div>

                {/* Last Update & Refresh */}
                <div className="flex items-center gap-3 px-3 border-l border-slate-700">
                    {lastUpdate && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock size={12} />
                            <span>{lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    )}
                    <span className="text-xs text-slate-400">
                        {marketData.length} stocks
                    </span>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="p-1.5 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                        title="Refresh data"
                    >
                        <RefreshCw size={14} className={`text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Click outside to close filter */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}
        </div>
    );
}
