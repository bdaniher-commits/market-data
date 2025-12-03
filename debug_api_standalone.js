
// Mock fetchWithFallback
const fetchWithFallback = async (targetUrl) => {
    const proxies = [
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

const fetchDailyOpportunities = async () => {
    try {
        console.log("Fetching Growth...");
        const growthUrl = 'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=undervalued_growth_stocks&count=50';
        const growthRes = await fetchWithFallback(growthUrl);
        const growthData = await growthRes.json();
        const growthCount = growthData.finance.result[0].quotes.length;
        console.log(`Growth count: ${growthCount}`);

        console.log("Fetching Shorts...");
        const shortUrl = 'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=most_shorted_stocks&count=50';
        const shortRes = await fetchWithFallback(shortUrl);
        const shortData = await shortRes.json();
        const shortCount = shortData.finance.result[0].quotes.length;
        console.log(`Shorts count: ${shortCount}`);

        console.log("Fetching Gainers...");
        const gainerUrl = 'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=day_gainers&count=20';
        const gainerRes = await fetchWithFallback(gainerUrl);
        const gainerData = await gainerRes.json();
        const gainerCount = gainerData.finance.result[0].quotes.length;
        console.log(`Gainers count: ${gainerCount}`);

    } catch (error) {
        console.error("Failed to fetch daily opportunities:", error);
    }
};

fetchDailyOpportunities();
