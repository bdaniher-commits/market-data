const fetchWithFallback = async (targetUrl) => {
    const proxies = [
        `https://corsproxy.io/?${targetUrl}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
    ];

    for (const url of proxies) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            console.warn(`Fetch failed for ${url}: ${response.status}`);
        } catch (e) {
            console.warn(`Fetch error for ${url}:`, e.message);
        }
        await new Promise(r => setTimeout(r, 500));
    }
    throw new Error('Failed to fetch data from all sources');
};

const checkTicker = async (ticker) => {
    try {
        console.log(`Checking ${ticker}...`);
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1mo`;
        const response = await fetchWithFallback(url);
        const data = await response.json();

        if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
            console.log("No result found");
            return;
        }

        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];

        console.log("Meta Data:", JSON.stringify(meta, null, 2));

        // Check for price data validity
        const closes = quote.close || [];
        const validCloses = closes.filter(p => p !== null);
        console.log(`Total Closes: ${closes.length}, Valid Closes: ${validCloses.length}`);
        console.log(`Last Price: ${meta.regularMarketPrice}`);
        console.log(`Exchange Name: ${meta.exchangeName}`);
        console.log(`Instrument Type: ${meta.instrumentType}`);
        console.log(`Trading Periods: ${JSON.stringify(meta.tradingPeriods, null, 2)}`);

    } catch (e) {
        console.error(`Error checking ${ticker}:`, e);
    }
};

checkTicker('NKLA');
