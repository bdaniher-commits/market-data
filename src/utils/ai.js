export const generateAIInsight = async (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const { ticker, price, changePercent, high52, volume, history } = data;
            const currentPrice = parseFloat(price);
            const high52Val = parseFloat(high52);
            const changePctVal = parseFloat(changePercent.replace('%', ''));

            // 1. Trend Analysis (SMA)
            const prices = history.map(h => h.price);
            const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
            const trend = currentPrice > avgPrice ? 'Bullish' : 'Bearish';
            const deviation = ((currentPrice - avgPrice) / avgPrice * 100).toFixed(1);

            // 2. Momentum Analysis
            let momentum = 'Neutral';
            if (changePctVal > 2) momentum = 'Strong Bullish';
            else if (changePctVal > 0.5) momentum = 'Bullish';
            else if (changePctVal < -2) momentum = 'Strong Bearish';
            else if (changePctVal < -0.5) momentum = 'Bearish';

            // 3. Resistance / Support Analysis
            const distToHigh = ((high52Val - currentPrice) / high52Val * 100).toFixed(1);
            let technicalSetup = '';
            if (distToHigh < 2) technicalSetup = 'testing major resistance at 52-week highs';
            else if (distToHigh < 5) technicalSetup = 'approaching key resistance levels';
            else if (distToHigh > 20) technicalSetup = 'in a significant drawdown, potentially finding support';
            else technicalSetup = 'trading within a consolidation range';

            // 4. Volume Analysis
            const volumeNum = parseFloat(volume.replace('M', ''));
            const volSentiment = volumeNum > 50 ? 'High institutional participation' : 'Moderate liquidity';

            // Construct Thesis
            const thesis = `
        Technical analysis for ${ticker} indicates a ${trend} trend, currently trading ${Math.abs(deviation)}% ${deviation > 0 ? 'above' : 'below'} its 20-day moving average. 
        Momentum is ${momentum} with the stock ${technicalSetup}. 
        ${volSentiment} suggests ${volumeNum > 50 ? 'strong conviction from smart money' : 'standard trading activity'}. 
        ${trend === 'Bullish' && momentum.includes('Bullish') ? 'Setup favors long positions on pullbacks.' :
                    trend === 'Bearish' && momentum.includes('Bearish') ? 'Risk remains to the downside; caution advised.' :
                        'Market is indecisive; await confirmation of breakout.'}
      `;

            resolve(thesis.trim());
        }, 1500);
    });
};
