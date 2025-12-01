const testBeta = async (ticker) => {
    const targetUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=summaryDetail,defaultKeyStatistics`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    console.log(`Testing: ${proxyUrl}`);

    try {
        const response = await fetch(proxyUrl);
        console.log(`Status: ${response.status}`);

        if (!response.ok) {
            console.log('Response not OK');
            return;
        }

        const text = await response.text();
        console.log(`Response length: ${text.length}`);

        try {
            const data = JSON.parse(text);
            const summary = data.quoteSummary.result[0].summaryDetail;
            console.log(`${ticker} Beta raw:`, summary.beta);
        } catch (e) {
            console.log('JSON Parse Error:', e.message);
            console.log('First 500 chars:', text.substring(0, 500));
        }

    } catch (e) {
        console.log('Fetch Error:', e.message);
    }
};

await testBeta('NVDA');
await testBeta('AAPL');
