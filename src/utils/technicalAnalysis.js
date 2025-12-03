export const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return null;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < prices.length; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) {
            avgGain = (avgGain * (period - 1) + diff) / period;
            avgLoss = (avgLoss * (period - 1) + 0) / period;
        } else {
            avgGain = (avgGain * (period - 1) + 0) / period;
            avgLoss = (avgLoss * (period - 1) + Math.abs(diff)) / period;
        }
    }

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
};

export const calculateSMA = (prices, period = 20) => {
    if (prices.length < period) return null;
    const slice = prices.slice(prices.length - period);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / period;
};

export const calculateShortScore = (rsi, price, sma, changePercent) => {
    let score = 0;

    // RSI Component (0-40 points)
    // High RSI = Overbought = Good for shorting
    if (rsi > 80) score += 40;
    else if (rsi > 70) score += 30;
    else if (rsi > 60) score += 15;
    else if (rsi < 30) score -= 20; // Oversold, bad for shorting

    // Trend Component (0-30 points)
    // Price below SMA = Downtrend = Good for shorting
    if (price < sma) score += 30;

    // Momentum Component (0-30 points)
    // Negative momentum is good for existing shorts
    const change = parseFloat(changePercent);
    if (change < -2) score += 30;
    else if (change < 0) score += 15;
    else if (change > 2) score -= 10; // Strong upward momentum is risky

    return Math.max(0, Math.min(100, score));
};

export const calculateBeta = (stockPrices, marketPrices) => {
    if (!stockPrices || !marketPrices || stockPrices.length < 30 || marketPrices.length < 30) return 1.0;

    // Align dates (assuming same interval and range, arrays should be roughly same length/aligned)
    // For simplicity in this MVP, we assume the arrays are aligned by index from the end (most recent)
    // A more robust solution would match by timestamp

    const len = Math.min(stockPrices.length, marketPrices.length);
    const stock = stockPrices.slice(-len);
    const market = marketPrices.slice(-len);

    const stockReturns = [];
    const marketReturns = [];

    for (let i = 1; i < len; i++) {
        stockReturns.push((stock[i] - stock[i - 1]) / stock[i - 1]);
        marketReturns.push((market[i] - market[i - 1]) / market[i - 1]);
    }

    const meanStock = stockReturns.reduce((a, b) => a + b, 0) / stockReturns.length;
    const meanMarket = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;

    let covariance = 0;
    let variance = 0;

    for (let i = 0; i < stockReturns.length; i++) {
        covariance += (stockReturns[i] - meanStock) * (marketReturns[i] - meanMarket);
        variance += (marketReturns[i] - meanMarket) ** 2;
    }

    return variance === 0 ? 1.0 : covariance / variance;
};
