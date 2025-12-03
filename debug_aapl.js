const fetchWithFallback = async (targetUrl) => {
    const proxies = [
        `https://corsproxy.io/?${targetUrl}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
    ];

    for (const url of proxies) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
        } catch (e) { }
        await new Promise(r => setTimeout(r, 500));
    }
    throw new Error('Failed to fetch');
};

const checkTicker = async (ticker) => {
    try {
        console.log(`Checking ${ticker}...`);
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1mo`;
        const response = await fetchWithFallback(url);
        const data = await response.json();
        const result = data.chart.result[0];
        const quote = result.indicators.quote[0];
        const closes = quote.close || [];
        const validCloses = closes.filter(p => p !== null);

        console.log(`${ticker} - Total Closes: ${closes.length}, Valid Closes: ${validCloses.length}`);
    } catch (e) {
        console.error(`Error checking ${ticker}:`, e);
    }
};

checkTicker('AAPL');
