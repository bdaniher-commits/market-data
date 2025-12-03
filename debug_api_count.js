import { fetchDailyOpportunities } from './src/utils/api.js';

// Mock fetchWithFallback since we are running in node
global.fetch = async (url) => {
    const { default: fetch } = await import('node-fetch');
    return fetch(url);
};

// Mock DOM/Browser specific things if needed, or just run the logic
// We need to handle the fact that api.js uses browser fetch. 
// Actually, api.js uses `fetchWithFallback` which uses `fetch`.
// in node 18+ fetch is global.

async function test() {
    console.log("Fetching daily opportunities...");
    try {
        const ops = await fetchDailyOpportunities();
        if (ops) {
            console.log(`Conviction count: ${ops.conviction.length}`);
            console.log(`Shorts count: ${ops.shorts.length}`);
            console.log("First 3 conviction:", ops.conviction.slice(0, 3).map(x => x.ticker));
        } else {
            console.log("Result is null");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
