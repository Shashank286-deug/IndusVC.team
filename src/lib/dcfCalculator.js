// Simplified DCF Valuation Calculator
// This provides a realistic but simplified DCF model for the prototype

export function calculateDCF({
    revenue,           // Current annual revenue in millions
    revenueGrowth,     // Annual growth rate (%)
    ebitMargin,        // EBIT margin (%)
    taxRate,           // Corporate tax rate (%)
    wacc,              // Weighted Average Cost of Capital (%)
    terminalGrowth,    // Terminal growth rate (%)
    shares,            // Shares outstanding in millions
    projectionYears = 5 // Years to project
}) {
    const growthRate = revenueGrowth / 100;
    const margin = ebitMargin / 100;
    const tax = taxRate / 100;
    const discount = wacc / 100;
    const terminal = terminalGrowth / 100;

    let presentValue = 0;
    let projectedRevenues = [];
    let fcfValues = [];

    // Project Free Cash Flows for 5 years
    for (let year = 1; year <= projectionYears; year++) {
        const projectedRevenue = revenue * Math.pow(1 + growthRate, year);
        const ebit = projectedRevenue * margin;
        const nopat = ebit * (1 - tax);
        // Simplified: assume FCF ≈ NOPAT (ignoring CapEx, WC changes for prototype)
        const fcf = nopat;

        const pv = fcf / Math.pow(1 + discount, year);
        presentValue += pv;

        projectedRevenues.push({
            year,
            revenue: projectedRevenue,
            fcf,
            pv
        });
        fcfValues.push(fcf);
    }

    // Terminal Value calculation
    const finalYearFCF = fcfValues[projectionYears - 1];
    const terminalFCF = finalYearFCF * (1 + terminal);
    const terminalValue = terminalFCF / (discount - terminal);
    const pvTerminalValue = terminalValue / Math.pow(1 + discount, projectionYears);

    // Enterprise Value
    const enterpriseValue = presentValue + pvTerminalValue;

    // Intrinsic Value per Share (simplified - not accounting for debt/cash)
    const intrinsicValue = enterpriseValue / shares;

    return {
        intrinsicValue: Math.round(intrinsicValue * 100) / 100,
        enterpriseValue: Math.round(enterpriseValue),
        presentValueFCF: Math.round(presentValue),
        terminalValue: Math.round(pvTerminalValue),
        projectedRevenues,
        fcfValues
    };
}

// Helper function to determine if stock is undervalued/overvalued
export function getValuationStatus(intrinsicValue, currentPrice) {
    const difference = intrinsicValue - currentPrice;
    const percentDifference = (difference / currentPrice) * 100;

    if (percentDifference > 15) {
        return { status: 'undervalued', color: 'profit', label: 'Undervalued' };
    } else if (percentDifference < -15) {
        return { status: 'overvalued', color: 'loss', label: 'Overvalued' };
    } else {
        return { status: 'fair', color: 'slate', label: 'Fair Value' };
    }
}
