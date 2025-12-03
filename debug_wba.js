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
        const result = data.chart.result[0];
        const quote = result.meta;

        console.log("Quote Data:", JSON.stringify(quote, null, 2));

        if (result.indicators.quote[0].close) {
            const prices = result.indicators.quote[0].close;
            const validPrices = prices.filter(p => p !== null);
            console.log(`Valid prices found: ${validPrices.length} / ${prices.length}`);
        }

    } catch (e) {
        console.error(`Error checking ${ticker}:`, e);
    }
};

checkTicker('WBA');
