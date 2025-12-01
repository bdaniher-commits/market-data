const calculateBeta = (stockPrices, marketPrices) => {
    if (!stockPrices || !marketPrices || stockPrices.length < 30 || marketPrices.length < 30) return 1.0;

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

const fetchPrices = async (ticker) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`;
    const proxyUrl = `https://corsproxy.io/?${url}`;

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        return data.chart.result[0].indicators.quote[0].close.filter(p => p !== null);
    } catch (e) {
        console.error(`Failed to fetch ${ticker}:`, e.message);
        return [];
    }
};

const runTest = async () => {
    console.log("Fetching SPY...");
    const spyPrices = await fetchPrices('SPY');
    console.log(`SPY Data Points: ${spyPrices.length}`);

    if (spyPrices.length === 0) return;

    const tickers = ['NVDA', 'KO', 'TSLA'];

    for (const ticker of tickers) {
        console.log(`\nFetching ${ticker}...`);
        const stockPrices = await fetchPrices(ticker);
        console.log(`${ticker} Data Points: ${stockPrices.length}`);

        const beta = calculateBeta(stockPrices, spyPrices);
        console.log(`>>> ${ticker} Calculated Beta: ${beta.toFixed(2)}`);
    }
};

await runTest();
