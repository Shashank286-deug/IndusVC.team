// Realistic Financial Mock Data for IndusVC Platform

// Portfolio Performance Data (6 months)
export const portfolioPerformance = [
    { date: 'Jul', portfolio: 1000000, sp500: 1000000 },
    { date: 'Aug', portfolio: 1045000, sp500: 1020000 },
    { date: 'Sep', portfolio: 1098000, sp500: 1015000 },
    { date: 'Oct', portfolio: 1125000, sp500: 1040000 },
    { date: 'Nov', portfolio: 1215000, sp500: 1080000 },
    { date: 'Dec', portfolio: 1287500, sp500: 1095000 },
];

// Market Indices
export const marketIndices = [
    { name: 'S&P 500', symbol: 'SPX', price: 4783.45, change: 0.67, changePercent: 0.014 },
    { name: 'NASDAQ', symbol: 'IXIC', price: 15095.14, change: -12.33, changePercent: -0.0082 },
    { name: 'DOW JONES', symbol: 'DJI', price: 37440.34, change: 45.29, changePercent: 0.0012 },
    { name: 'RUSSELL 2000', symbol: 'RUT', price: 2073.52, change: 8.94, changePercent: 0.0043 },
    { name: 'VIX', symbol: 'VIX', price: 13.42, change: -0.75, changePercent: -0.053 },
];

// Dashboard Metrics
export const dashboardMetrics = {
    portfolioValue: 1287500,
    portfolioValueChange: 72500,
    portfolioValueChangePercent: 5.97,
    daysGain: 15240,
    daysGainPercent: 1.2,
    riskScore: 6.8,
    riskChange: -0.3,
};

// Sector Allocation
export const sectorAllocation = [
    { name: 'Technology', value: 42, color: '#3b82f6' },
    { name: 'Healthcare', value: 18, color: '#10b981' },
    { name: 'Financial', value: 15, color: '#f97316' },
    { name: 'Consumer', value: 12, color: '#8b5cf6' },
    { name: 'Industrial', value: 8, color: '#eab308' },
    { name: 'Energy', value: 5, color: '#ef4444' },
];

// Portfolio Holdings
export const holdings = [
    {
        symbol: 'MSFT',
        name: 'Microsoft Corp',
        sector: 'Technology',
        allocation: 12.5,
        value: 160937.50,
        risk: 'Medium',
        return: 18.2
    },
    {
        symbol: 'NVDA',
        name: 'NVIDIA Corp',
        sector: 'Technology',
        allocation: 10.8,
        value: 139050,
        risk: 'High',
        return: 45.6
    },
    {
        symbol: 'AAPL',
        name: 'Apple Inc',
        sector: 'Technology',
        allocation: 9.2,
        value: 118450,
        risk: 'Low',
        return: 12.4
    },
    {
        symbol: 'UNH',
        name: 'UnitedHealth Group',
        sector: 'Healthcare',
        allocation: 8.5,
        value: 109437.50,
        risk: 'Low',
        return: 8.7
    },
    {
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        sector: 'Healthcare',
        allocation: 7.3,
        value: 93987.50,
        risk: 'Low',
        return: 6.2
    },
    {
        symbol: 'JPM',
        name: 'JPMorgan Chase',
        sector: 'Financial',
        allocation: 6.8,
        value: 87550,
        risk: 'Medium',
        return: 14.1
    },
    {
        symbol: 'V',
        name: 'Visa Inc',
        sector: 'Financial',
        allocation: 5.9,
        value: 75962.50,
        risk: 'Medium',
        return: 16.8
    },
    {
        symbol: 'TSLA',
        name: 'Tesla Inc',
        sector: 'Consumer',
        allocation: 5.4,
        value: 69525,
        risk: 'High',
        return: 32.5
    },
];

// DCF Model Default Parameters
export const dcfDefaults = {
    currentPrice: 185.50,
    revenue: 50000, // millions
    revenueGrowth: 12, // %
    ebitMargin: 28, // %
    taxRate: 21, // %
    wacc: 9.5, // %
    terminalGrowth: 3.0, // %
    shares: 1000, // millions
};

// AI Chat Conversation
export const aiChatHistory = [
    {
        role: 'user',
        message: 'Why is the operating margin declining in Q3?',
        timestamp: '2:34 PM',
    },
    {
        role: 'assistant',
        message: `Operating margin decreased from 32.4% to 28.1% primarily due to:

1. Cost of Goods Sold (COGS) increased by 12.3% YoY
2. Supply chain disruptions added $4.2M in logistics costs
3. R&D expenses increased 18% to $12.5M

**Primary Driver:** COGS pressure from commodity price inflation, particularly in semiconductor components which rose 23% during the quarter.`,
        citations: [
            { text: 'COGS Analysis', page: 14, section: 'Operating Expenses' },
            { text: 'Supply Chain Impact', page: 22, section: 'Risk Factors' },
        ],
        timestamp: '2:34 PM',
    },
    {
        role: 'user',
        message: 'What is the Free Cash Flow trend?',
        timestamp: '2:36 PM',
    },
    {
        role: 'assistant',
        message: `Free Cash Flow has shown strong growth:

Q1 2024: $84.2M (+15% YoY)
Q2 2024: $91.7M (+22% YoY)  
Q3 2024: $88.3M (+18% YoY)

Trailing 12-Month FCF: $348.6M
FCF Margin: 24.3%

The company is converting earnings to cash efficiently, with FCF/Net Income ratio of 1.12x.`,
        citations: [
            { text: 'Cash Flow Statement', page: 8, section: 'Financial Statements' },
        ],
        timestamp: '2:36 PM',
    },
];

// Risk Alerts
export const riskAlerts = [
    {
        id: 1,
        severity: 'high',
        title: 'High Technology Concentration',
        message: 'Portfolio has 42% allocation to Technology sector, exceeding recommended 30% threshold.',
        recommendation: 'Consider rebalancing into defensive sectors (Healthcare, Utilities).',
    },
    {
        id: 2,
        severity: 'medium',
        title: 'Elevated Volatility Detected',
        message: 'NVDA and TSLA combined represent 16.2% of portfolio with beta > 1.8.',
        recommendation: 'Add low-beta holdings to reduce overall portfolio volatility.',
    },
];

// Correlation Matrix for Top 5 Holdings
export const correlationMatrix = {
    symbols: ['MSFT', 'NVDA', 'AAPL', 'UNH', 'JNJ'],
    names: ['Microsoft', 'NVIDIA', 'Apple', 'UnitedHealth', 'J&J'],
    // Correlation coefficients (symmetric matrix, only upper triangle used)
    data: [
        [1.00, 0.82, 0.76, 0.28, 0.25],  // MSFT
        [0.82, 1.00, 0.71, 0.22, 0.19],  // NVDA
        [0.76, 0.71, 1.00, 0.31, 0.27],  // AAPL
        [0.28, 0.22, 0.31, 1.00, 0.65],  // UNH
        [0.25, 0.19, 0.27, 0.65, 1.00],  // JNJ
    ]
};

// Risk Score Trend Data
export const riskTrend = {
    direction: 'down',      // 'up' or 'down'
    change: 0.4,            // absolute change
    period: 'from yesterday'
};

// News Impact Mapping (keywords to impact based on portfolio holdings)
export const impactKeywords = {
    high: ['Banking', 'JPM', 'JPMorgan', 'Technology', 'AI', 'MSFT', 'Microsoft', 'NVDA', 'NVIDIA', 'AAPL', 'Apple', 'Healthcare', 'UNH', 'JNJ'],
    medium: ['Market', 'Fed', 'Interest Rate', 'Inflation', 'GDP', 'Economy'],
    low: ['Crypto', 'Bitcoin', 'Real Estate', 'Commodities']
};

