const testQuote = async (ticker) => {
    const targetUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;
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

        try {
            const data = JSON.parse(text);
            const result = data.quoteResponse.result[0];
            console.log(`${ticker} Beta (quote):`, result.beta);
            console.log(`${ticker} Beta3Year (quote):`, result.beta3Year);
        } catch (e) {
            console.log('JSON Parse Error:', e.message);
            console.log('First 500 chars:', text.substring(0, 500));
        }

    } catch (e) {
        console.log('Fetch Error:', e.message);
    }
};

await testQuote('NVDA');
await testQuote('AAPL');
