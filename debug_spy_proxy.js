const testSpy = async () => {
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=3mo`;
    const proxyUrl = `https://corsproxy.io/?${targetUrl}`;

    console.log(`Testing: ${proxyUrl}`);

    try {
        const response = await fetch(proxyUrl);
        console.log(`Status: ${response.status}`);

        if (!response.ok) {
            console.log('Response not OK');
            return;
        }

        const data = await response.json();
        const result = data.chart.result[0];
        const prices = result.timestamp.map((t, i) => ({
            date: t,
            close: result.indicators.quote[0].close[i]
        }));

        console.log(`SPY Data Points: ${prices.length}`);
        console.log('First point:', prices[0]);

    } catch (e) {
        console.log('Fetch Error:', e.message);
    }
};

await testSpy();
