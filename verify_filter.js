// Mock Data
const currentList = [
    { ticker: 'AAPL', name: 'Apple' },
    { ticker: 'NKLA', name: 'Nikola' }, // Should fail (insufficient data)
    { ticker: 'NVDA', name: 'Nvidia' }
];

// Mock Fetch Logic (simulating App.jsx logic)
const fetchSimpleQuote = async (ticker) => {
    if (ticker === 'NKLA') {
        // Simulate sparse data (e.g., 1 point)
        const prices = [0.18];
        const validPrices = prices.filter(p => p !== null);
        if (validPrices.length < 5) return null;
        return { price: 0.18 };
    }

    // Simulate normal data
    const prices = new Array(20).fill(100);
    const validPrices = prices.filter(p => p !== null);
    if (validPrices.length < 5) return null;
    return { price: 100 };
};

const runTest = async () => {
    console.log("Initial List:", currentList.map(i => i.ticker));

    const updatedList = currentList.map(item => ({ ...item }));
    const batchSize = 3;

    for (let i = 0; i < currentList.length; i += batchSize) {
        const batch = currentList.slice(i, i + batchSize);
        const promises = batch.map(async (item, batchIdx) => {
            const quote = await fetchSimpleQuote(item.ticker);
            if (quote) {
                updatedList[i + batchIdx] = { ...item, ...quote };
            } else {
                updatedList[i + batchIdx] = { ...item, _shouldRemove: true };
            }
        });
        await Promise.all(promises);
    }

    const finalState = updatedList.filter(item => !item._shouldRemove);

    console.log("Final List:", finalState.map(i => i.ticker));

    if (finalState.length === 2 && !finalState.find(i => i.ticker === 'NKLA')) {
        console.log("SUCCESS: NKLA was filtered out due to insufficient data.");
    } else {
        console.error("FAILURE: NKLA was NOT filtered out.");
    }
};

runTest();
