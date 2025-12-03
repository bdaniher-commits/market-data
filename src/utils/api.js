import { calculateRSI, calculateSMA, calculateShortScore, calculateBeta } from './technicalAnalysis';
import { formatMarketCap } from './formatters';

export const fetchWithFallback = async (targetUrl) => {
    const proxies = [
        `/api/proxy?url=${encodeURIComponent(targetUrl)}`,
        `https://corsproxy.io/?${targetUrl}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
        `https://thingproxy.freeboard.io/fetch/${targetUrl}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
    ];

    for (const url of proxies) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            console.warn(`Fetch failed for ${url}: ${response.status}`);
        } catch (e) {
            console.warn(`Fetch error for ${url}:`, e.message);
        }
        // Add a small delay between proxy attempts to be nice
        await new Promise(r => setTimeout(r, 500));
    }
    throw new Error('Failed to fetch data from all sources');
};

export const fetchTickerData = async (ticker) => {
    try {
        // Fetch 1 month of daily data for the chart
        const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1mo`;
        const response = await fetchWithFallback(targetUrl);

        const data = await response.json();
        const result = data.chart.result[0];
        const quote = result.meta;

        // Process chart data
        const timestamps = result.timestamp;
        const prices = result.indicators.quote[0].close;

        const history = timestamps.map((time, index) => ({
            date: new Date(time * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            price: prices[index] ? parseFloat(prices[index].toFixed(2)) : null
        })).filter(item => item.price !== null);

        return {
            ticker: quote.symbol,
            name: quote.shortName || quote.longName || quote.symbol,
            price: quote.regularMarketPrice.toFixed(2),
            change: (quote.regularMarketPrice - quote.chartPreviousClose).toFixed(2),
            changePercent: ((quote.regularMarketPrice - quote.chartPreviousClose) / quote.chartPreviousClose * 100).toFixed(2) + '%',
            volume: (quote.regularMarketVolume / 1000000).toFixed(1) + 'M',
            marketCap: 'N/A',
            peRatio: 'N/A',
            high52: quote.fiftyTwoWeekHigh ? quote.fiftyTwoWeekHigh.toFixed(2) : 'N/A',
            history: history
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

import { MACRO_DATA, OPPORTUNITY_DATA } from '../data/constants';

export const fetchDailyOpportunities = async () => {
    try {
        // 1. Fetch Conviction Candidates (Undervalued Growth)
        const growthUrl = 'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=undervalued_growth_stocks&count=50';
        const growthRes = await fetchWithFallback(growthUrl);
        const growthData = await growthRes.json();
        const growthTickers = growthData.finance.result[0].quotes.slice(0, 50).map(q => ({
            ticker: q.symbol,
            name: q.shortName || q.longName || q.symbol,
            price: q.regularMarketPrice.toFixed(2),
            allocation: '4.0%', // Default allocation
            signal: 'Buy',
            exchange: q.exchange
        }));

        // 2. Fetch Short Candidates (Most Shorted)
        const shortUrl = 'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=most_shorted_stocks&count=50';
        const shortRes = await fetchWithFallback(shortUrl);
        const shortData = await shortRes.json();
        const shortTickers = shortData.finance.result[0].quotes.slice(0, 50).map(q => ({
            ticker: q.symbol,
            name: q.shortName || q.longName || q.symbol,
            price: q.regularMarketPrice.toFixed(2),
            allocation: '2.0%',
            signal: 'Short',
            exchange: q.exchange
        }));

        // 3. Fetch Speculative/Momentum (Day Gainers)
        const gainerUrl = 'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=day_gainers&count=20';
        const gainerRes = await fetchWithFallback(gainerUrl);
        const gainerData = await gainerRes.json();
        const gainerTickers = gainerData.finance.result[0].quotes.slice(0, 20).map(q => ({
            ticker: q.symbol,
            name: q.shortName || q.longName || q.symbol,
            price: q.regularMarketPrice.toFixed(2),
            allocation: '1.0%',
            signal: 'Spec Buy',
            exchange: q.exchange
        }));

        // Combine for Conviction List (Growth + Speculative)
        const apiConviction = [...growthTickers, ...gainerTickers];
        const apiShorts = shortTickers;

        // Helper to merge API data with static data (deduplicating by ticker)
        const mergeData = (apiList, staticList) => {
            const apiTickers = new Set(apiList.map(item => item.ticker));
            const uniqueStatic = staticList.filter(item => !apiTickers.has(item.ticker));
            return [...apiList, ...uniqueStatic];
        };

        return {
            conviction: mergeData(apiConviction, OPPORTUNITY_DATA.conviction),
            shorts: mergeData(apiShorts, OPPORTUNITY_DATA.shorts)
        };

    } catch (error) {
        console.warn("Failed to fetch daily opportunities, using fallback data:", error);
        // Fallback to static data if API fails
        return {
            conviction: OPPORTUNITY_DATA.conviction,
            shorts: OPPORTUNITY_DATA.shorts
        };
    }
};

export const fetchSpyData = async () => {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=3mo`;
        const response = await fetchWithFallback(url);
        const data = await response.json();
        const prices = data.chart.result[0].indicators.quote[0].close;
        return prices;
    } catch (e) {
        console.warn("Failed to fetch SPY data for Beta calculation", e);
        return [];
    }
};

export const fetchSimpleQuote = async (ticker, spyPrices = []) => {
    try {
        // Fetch chart data
        const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`;
        const response = await fetchWithFallback(chartUrl);

        const data = await response.json();
        const result = data.chart.result[0];
        const quote = result.meta;
        const prices = data.chart.result[0].indicators.quote[0].close;
        const validPrices = prices.filter(p => p !== null);

        // Filter out inactive stocks (insufficient data points)
        if (validPrices.length < 5) {
            console.warn(`Skipping ${ticker}: Insufficient data (${validPrices.length} points)`);
            return null;
        }

        const currentPrice = validPrices[validPrices.length - 1];

        // Calculate Indicators
        const cleanPrices = validPrices;

        const rsi = calculateRSI(cleanPrices);
        const sma20 = calculateSMA(cleanPrices, 20);
        const shortScore = (rsi && sma20) ? calculateShortScore(rsi, currentPrice, sma20, quote.regularMarketChangePercent) : null;

        // Calculate Beta
        const beta = calculateBeta(cleanPrices, spyPrices);

        return {
            price: currentPrice.toFixed(2),
            change: (currentPrice - quote.chartPreviousClose).toFixed(2),
            changePercent: ((currentPrice - quote.chartPreviousClose) / quote.chartPreviousClose * 100).toFixed(2) + '%',
            marketCap: formatMarketCap(quote.marketCap),
            high52: quote.fiftyTwoWeekHigh,
            low52: quote.fiftyTwoWeekLow,
            rsi: rsi ? rsi.toFixed(1) : 'N/A',
            sma20: sma20 ? sma20.toFixed(2) : 'N/A',
            shortScore: shortScore ? Math.round(shortScore) : 'N/A',
            beta: beta.toFixed(2)
        };
    } catch (error) {
        console.error(`Error fetching quote for ${ticker}:`, error);
        return null;
    }
};
