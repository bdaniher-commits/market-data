
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
    }
    throw new Error('Failed to fetch data from all sources');
};

const fetchDailyOpportunities = async () => {
    try {
        console.log("Fetching shorts...");
        const shortUrl = 'https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=most_shorted_stocks&count=10';
        const shortRes = await fetchWithFallback(shortUrl);
        const shortData = await shortRes.json();

        if (!shortData.finance || !shortData.finance.result || !shortData.finance.result[0].quotes) {
            console.error("Invalid data structure:", JSON.stringify(shortData).substring(0, 200));
            return;
        }

        const quotes = shortData.finance.result[0].quotes;
        console.log(`Found ${quotes.length} short candidates.`);
        quotes.forEach(q => console.log(`- ${q.symbol}: ${q.regularMarketPrice}`));

    } catch (error) {
        console.error("Failed to fetch daily opportunities:", error);
    }
};

fetchDailyOpportunities();
