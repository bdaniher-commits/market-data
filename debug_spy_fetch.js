const fetchWithFallback = async (targetUrl) => {
    const proxies = [
        `https://corsproxy.io/?${targetUrl}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
        `https://thingproxy.freeboard.io/fetch/${targetUrl}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
    ];

    for (const url of proxies) {
        console.log(`Trying: ${url}`);
        try {
            const response = await fetch(url);
            if (response.ok) {
                console.log(`Success: ${url}`);
                return response;
            }
            console.warn(`Fetch failed for ${url}: ${response.status}`);
        } catch (e) {
            console.warn(`Fetch error for ${url}:`, e.message);
        }
    }
    throw new Error('Failed to fetch data from all sources');
};

const fetchSpyData = async () => {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=3mo`;
        const response = await fetchWithFallback(url);
        const data = await response.json();
        const prices = data.chart.result[0].indicators.quote[0].close;
        console.log(`Fetched ${prices.length} SPY prices`);
        return prices;
    } catch (e) {
        console.warn("Failed to fetch SPY data for Beta calculation", e);
        return [];
    }
};

const fetchTickerData = async (ticker) => {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`;
        const response = await fetchWithFallback(url);
        const data = await response.json();
        const prices = data.chart.result[0].indicators.quote[0].close;
        console.log(`Fetched ${prices.length} ${ticker} prices`);
        return prices;
    } catch (e) {
        console.warn(`Failed to fetch ${ticker} data`, e);
        return [];
    }
};

const calculateBeta = (stockPrices, marketPrices) => {
    if (!stockPrices || !marketPrices || stockPrices.length < 30 || marketPrices.length < 30) {
        console.log("Insufficient data for beta calculation");
        return 1.0;
    }

    const len = Math.min(stockPrices.length, marketPrices.length);
    const stock = stockPrices.slice(-len);
    const market = marketPrices.slice(-len);

    const stockReturns = [];
    const marketReturns = [];

    for (let i = 1; i < len; i++) {
        const stockRet = (stock[i] - stock[i - 1]) / stock[i - 1];
        const marketRet = (market[i] - market[i - 1]) / market[i - 1];
        if (!isNaN(stockRet) && !isNaN(marketRet)) {
            stockReturns.push(stockRet);
            marketReturns.push(marketRet);
        }
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

const test = async () => {
    console.log("Fetching SPY...");
    const spyPrices = await fetchSpyData();
    
    console.log("Fetching NVDA...");
    const nvdaPrices = await fetchTickerData('NVDA');

    console.log("Calculating Beta...");
    const beta = calculateBeta(nvdaPrices, spyPrices);
    console.log(`Calculated Beta for NVDA: ${beta.toFixed(2)}`);
};

test();
