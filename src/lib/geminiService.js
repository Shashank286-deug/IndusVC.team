// Gemini API Service for Real-Time Indian Stock Market Data
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Get API key from environment
const getApiKey = () => {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// Indian Stock Market Indices
export const INDIAN_INDICES = [
    { symbol: 'NIFTY50', name: 'NIFTY 50', exchange: 'NSE' },
    { symbol: 'SENSEX', name: 'SENSEX', exchange: 'BSE' },
    { symbol: 'BANKNIFTY', name: 'Bank NIFTY', exchange: 'NSE' },
    { symbol: 'NIFTYIT', name: 'NIFTY IT', exchange: 'NSE' },
    { symbol: 'NIFTYFIN', name: 'NIFTY Financial', exchange: 'NSE' },
];

// Popular Indian Stocks
export const POPULAR_STOCKS = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking' },
    { symbol: 'INFY', name: 'Infosys', sector: 'IT' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom' },
    { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking' },
    { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure' },
];

/**
 * Fetch real-time Indian market news using Gemini API
 */
export async function fetchMarketNews() {
    const apiKey = getApiKey();

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.warn('Gemini API key not configured. Using mock data.');
        return getMockNews();
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a financial news API. Provide the latest 5 important news headlines about the Indian stock market (NSE/BSE) from today. 
            
            Format your response EXACTLY as a JSON array with this structure:
            [
              {
                "headline": "News headline here",
                "summary": "Brief 1-2 sentence summary",
                "category": "Market|Stocks|Economy|IPO|FII/DII|Regulatory",
                "impact": "positive|negative|neutral",
                "time": "X hours ago"
              }
            ]
            
            Only respond with the JSON array, no other text.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse the JSON response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return getMockNews();
    } catch (error) {
        console.error('Error fetching market news:', error);
        return getMockNews();
    }
}

/**
 * Fetch real-time stock prices using Gemini API
 */
export async function fetchStockPrices(symbols = INDIAN_INDICES.map(i => i.symbol)) {
    const apiKey = getApiKey();

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.warn('Gemini API key not configured. Using mock data.');
        return getMockPrices();
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a stock price API. Provide the current prices for these Indian market indices/stocks: ${symbols.join(', ')}.
            
            Format your response EXACTLY as a JSON array with this structure:
            [
              {
                "symbol": "NIFTY50",
                "name": "NIFTY 50",
                "price": 24150.50,
                "change": 125.30,
                "changePercent": 0.52,
                "high": 24200.00,
                "low": 24050.00,
                "volume": "125.5M"
              }
            ]
            
            Use realistic current market prices for December 2024.
            Only respond with the JSON array, no other text.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return getMockPrices();
    } catch (error) {
        console.error('Error fetching stock prices:', error);
        return getMockPrices();
    }
}

/**
 * Get market analysis using Gemini API
 */
export async function getMarketAnalysis(query) {
    const apiKey = getApiKey();

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return {
            analysis: 'Please configure your Gemini API key in the .env file to get real-time analysis.',
            source: 'mock'
        };
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an expert Indian stock market analyst. ${query}
            
            Provide a concise, professional analysis in 2-3 paragraphs. Focus on:
            - Current market sentiment
            - Key factors affecting the market
            - Potential outlook
            
            Be factual and balanced.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 512,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return { analysis, source: 'gemini' };
    } catch (error) {
        console.error('Error getting market analysis:', error);
        return {
            analysis: 'Unable to fetch analysis. Please try again later.',
            source: 'error'
        };
    }
}

// Mock data functions for fallback
function getMockNews() {
    return [
        {
            headline: 'NIFTY 50 Hits New All-Time High Amid FII Inflows',
            summary: 'Strong buying from foreign institutional investors pushed the benchmark index to record levels.',
            category: 'Market',
            impact: 'positive',
            time: '2 hours ago'
        },
        {
            headline: 'RBI Keeps Repo Rate Unchanged at 6.5%',
            summary: 'The central bank maintained status quo on interest rates, focusing on inflation management.',
            category: 'Economy',
            impact: 'neutral',
            time: '4 hours ago'
        },
        {
            headline: 'IT Stocks Rally on Strong US Dollar',
            summary: 'TCS, Infosys, and Wipro gained 2-3% as rupee depreciation benefits export earnings.',
            category: 'Stocks',
            impact: 'positive',
            time: '5 hours ago'
        },
        {
            headline: 'Banking Sector Under Pressure After RBI Directive',
            summary: 'New provisioning norms for unsecured loans impacted banking stocks negatively.',
            category: 'Regulatory',
            impact: 'negative',
            time: '6 hours ago'
        },
        {
            headline: 'FIIs Net Buyers for 5th Consecutive Session',
            summary: 'Foreign investors pumped ₹2,500 crore into Indian equities today.',
            category: 'FII/DII',
            impact: 'positive',
            time: '8 hours ago'
        }
    ];
}

function getMockPrices() {
    return [
        { symbol: 'NIFTY50', name: 'NIFTY 50', price: 24156.50, change: 127.35, changePercent: 0.53, high: 24198.00, low: 24012.00, volume: '142.3M' },
        { symbol: 'SENSEX', name: 'SENSEX', price: 79892.45, change: 412.80, changePercent: 0.52, high: 79950.00, low: 79420.00, volume: '98.7M' },
        { symbol: 'BANKNIFTY', name: 'Bank NIFTY', price: 51250.75, change: -85.40, changePercent: -0.17, high: 51450.00, low: 51100.00, volume: '67.2M' },
        { symbol: 'NIFTYIT', name: 'NIFTY IT', price: 38450.20, change: 520.15, changePercent: 1.37, high: 38550.00, low: 37900.00, volume: '45.8M' },
        { symbol: 'NIFTYFIN', name: 'NIFTY Financial', price: 22180.30, change: 45.60, changePercent: 0.21, high: 22250.00, low: 22100.00, volume: '52.1M' },
    ];
}

// Check if API key is configured
export function isApiConfigured() {
    const apiKey = getApiKey();
    return apiKey && apiKey !== 'your_gemini_api_key_here';
}
