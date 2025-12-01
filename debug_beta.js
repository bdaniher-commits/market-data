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
            console.warn(`Fetch error for ${url}:`, e);
        }
    }
    throw new Error('Failed to fetch data from all sources');
};

const checkBeta = async (ticker) => {
    try {
        // Check Quote Summary (most reliable for beta)
        const summaryUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=summaryDetail,defaultKeyStatistics`;
        const summaryResp = await fetchWithFallback(summaryUrl);
        const summaryData = await summaryResp.json();
        const beta = summaryData.quoteSummary.result[0].summaryDetail.beta;

        console.log(`${ticker} Beta (Summary):`, beta);
    } catch (e) {
        console.error(`Error fetching beta for ${ticker}:`, e.message);
    }
};

checkBeta('NVDA');
checkBeta('AAPL');
