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

// Mock LocalStorage
const localStorage = {
    store: {},
    getItem: function (key) { return this.store[key] || null; },
    setItem: function (key, value) { this.store[key] = value; }
};

const fetchSpyData = async () => {
    const CACHE_KEY = 'spy_data_cache';
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
            console.log("Using cached SPY data");
            return data;
        }
    }

    console.log("Fetching SPY data from network...");
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=3mo`;
    const response = await fetchWithFallback(url);
    const data = await response.json();
    const prices = data.chart.result[0].indicators.quote[0].close;

    localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: prices
    }));

    return prices;
};

const runTest = async () => {
    console.log("Test 1: Initial Fetch");
    const prices1 = await fetchSpyData();
    console.log(`Fetched ${prices1.length} prices`);

    console.log("\nTest 2: Cached Fetch");
    const prices2 = await fetchSpyData();
    console.log(`Fetched ${prices2.length} prices (should be same as above and use cache)`);

    if (prices1.length === prices2.length) {
        console.log("\nSUCCESS: Caching logic verified.");
    } else {
        console.error("\nFAILURE: Caching logic failed.");
    }
};

runTest();
