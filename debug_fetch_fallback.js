const fetchWithFallback = async (targetUrl) => {
    const proxies = [
        `https://corsproxy.io/?${targetUrl}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
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

const testFetch = async (ticker) => {
    try {
        const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`;
        const response = await fetchWithFallback(chartUrl);
        const data = await response.json();
        const result = data.chart.result[0];
        const price = result.meta.regularMarketPrice;
        console.log(`${ticker} Price: ${price}`);
    } catch (e) {
        console.error(`Error fetching ${ticker}:`, e.message);
    }
};

await testFetch('NVDA');
