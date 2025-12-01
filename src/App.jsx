import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  X,
  Sparkles,
  BrainCircuit,
  Sun,
  Moon,
  RefreshCw,
  TrendingDown as BearishIcon,
  TrendingUp as BullishIcon,
  HelpCircle,
  BookOpen,
  PieChart,
  Target,
  ShieldAlert,
  Download,
  DollarSign,
  FileText
} from 'lucide-react';

// --- Mock Data ---

const MACRO_DATA = [
  { label: 'S&P 500', value: '4,783.45', change: '+0.45%', isPositive: true },
  { label: 'NASDAQ', value: '15,055.65', change: '+0.75%', isPositive: true },
  { label: '10Y Yield', value: '4.02%', change: '-0.05%', isPositive: true }, // Inverse logic handled in component
  { label: 'VIX', value: '13.45', change: '-1.20%', isPositive: true },       // Inverse logic handled in component
];



const OPPORTUNITY_DATA = {
  conviction: [
    { ticker: 'NVDA', name: 'NVIDIA Corp', price: '545.00', allocation: '8.5%', signal: 'Strong Buy', exchange: 'NASDAQ' },
    { ticker: 'MSFT', name: 'Microsoft Corp', price: '390.00', allocation: '7.0%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'AMZN', name: 'Amazon.com', price: '155.00', allocation: '6.5%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'GOOGL', name: 'Alphabet Inc', price: '140.00', allocation: '6.0%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'META', name: 'Meta Platforms', price: '365.00', allocation: '5.5%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'AMD', name: 'Adv. Micro Dev', price: '135.00', allocation: '5.0%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'AVGO', name: 'Broadcom Inc', price: '1100.00', allocation: '4.5%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'TSLA', name: 'Tesla Inc', price: '215.00', allocation: '4.0%', signal: 'Hold', exchange: 'NASDAQ' },
    { ticker: 'PLTR', name: 'Palantir Tech', price: '16.50', allocation: '3.5%', signal: 'Spec Buy', exchange: 'NYSE' },
    { ticker: 'COIN', name: 'Coinbase Global', price: '125.00', allocation: '3.0%', signal: 'Spec Buy', exchange: 'NASDAQ' },
    { ticker: 'AAPL', name: 'Apple Inc', price: '185.00', allocation: '3.0%', signal: 'Hold', exchange: 'NASDAQ' },
    { ticker: 'NFLX', name: 'Netflix Inc', price: '480.00', allocation: '2.5%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'CRM', name: 'Salesforce', price: '260.00', allocation: '2.5%', signal: 'Buy', exchange: 'NYSE' },
    { ticker: 'ADBE', name: 'Adobe Inc', price: '590.00', allocation: '2.0%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'INTC', name: 'Intel Corp', price: '45.00', allocation: '2.0%', signal: 'Hold', exchange: 'NASDAQ' },
    { ticker: 'QCOM', name: 'Qualcomm', price: '140.00', allocation: '2.0%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'TXN', name: 'Texas Inst', price: '165.00', allocation: '1.5%', signal: 'Hold', exchange: 'NASDAQ' },
    { ticker: 'IBM', name: 'IBM Corp', price: '160.00', allocation: '1.5%', signal: 'Buy', exchange: 'NYSE' },
    { ticker: 'ORCL', name: 'Oracle Corp', price: '105.00', allocation: '1.5%', signal: 'Buy', exchange: 'NYSE' },
    { ticker: 'CSCO', name: 'Cisco Systems', price: '50.00', allocation: '1.5%', signal: 'Hold', exchange: 'NASDAQ' },
    { ticker: 'UBER', name: 'Uber Tech', price: '60.00', allocation: '1.5%', signal: 'Buy', exchange: 'NYSE' },
    { ticker: 'ABNB', name: 'Airbnb Inc', price: '135.00', allocation: '1.0%', signal: 'Hold', exchange: 'NASDAQ' },
    { ticker: 'DASH', name: 'DoorDash', price: '95.00', allocation: '1.0%', signal: 'Spec Buy', exchange: 'NASDAQ' },
    { ticker: 'SQ', name: 'Block Inc', price: '65.00', allocation: '1.0%', signal: 'Spec Buy', exchange: 'NYSE' },
    { ticker: 'PYPL', name: 'PayPal Hldgs', price: '58.00', allocation: '1.0%', signal: 'Value Buy', exchange: 'NASDAQ' },
    { ticker: 'SHOP', name: 'Shopify Inc', price: '75.00', allocation: '1.0%', signal: 'Buy', exchange: 'NYSE' },
    { ticker: 'SNOW', name: 'Snowflake', price: '190.00', allocation: '1.0%', signal: 'Spec Buy', exchange: 'NYSE' },
    { ticker: 'PANW', name: 'Palo Alto Net', price: '300.00', allocation: '1.0%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'CRWD', name: 'CrowdStrike', price: '280.00', allocation: '1.0%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'ZS', name: 'Zscaler Inc', price: '220.00', allocation: '0.8%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'NET', name: 'Cloudflare', price: '80.00', allocation: '0.8%', signal: 'Hold', exchange: 'NYSE' },
    { ticker: 'DDOG', name: 'Datadog Inc', price: '120.00', allocation: '0.8%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'MDB', name: 'MongoDB', price: '400.00', allocation: '0.8%', signal: 'Spec Buy', exchange: 'NASDAQ' },
    { ticker: 'TTD', name: 'Trade Desk', price: '70.00', allocation: '0.8%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'ROKU', name: 'Roku Inc', price: '85.00', allocation: '0.5%', signal: 'Spec Buy', exchange: 'NASDAQ' },
    { ticker: 'DKNG', name: 'DraftKings', price: '35.00', allocation: '0.5%', signal: 'Buy', exchange: 'NASDAQ' },
    { ticker: 'HOOD', name: 'Robinhood', price: '12.00', allocation: '0.5%', signal: 'Spec Buy', exchange: 'NASDAQ' },
    { ticker: 'AFRM', name: 'Affirm Hldgs', price: '40.00', allocation: '0.5%', signal: 'Spec Buy', exchange: 'NASDAQ' },
    { ticker: 'UPST', name: 'Upstart Hldgs', price: '30.00', allocation: '0.5%', signal: 'Spec Buy', exchange: 'NASDAQ' },
    { ticker: 'SOFI', name: 'SoFi Tech', price: '8.00', allocation: '0.5%', signal: 'Spec Buy', exchange: 'NASDAQ' },
    { ticker: 'PATH', name: 'UiPath Inc', price: '22.00', allocation: '0.5%', signal: 'Hold', exchange: 'NYSE' },
    { ticker: 'U', name: 'Unity Software', price: '35.00', allocation: '0.5%', signal: 'Spec Buy', exchange: 'NYSE' },
    { ticker: 'RBLX', name: 'Roblox Corp', price: '40.00', allocation: '0.5%', signal: 'Hold', exchange: 'NYSE' },
    { ticker: 'ETSY', name: 'Etsy Inc', price: '70.00', allocation: '0.5%', signal: 'Value Buy', exchange: 'NASDAQ' },
    { ticker: 'PINS', name: 'Pinterest', price: '35.00', allocation: '0.5%', signal: 'Buy', exchange: 'NYSE' },
    { ticker: 'SNAP', name: 'Snap Inc', price: '15.00', allocation: '0.5%', signal: 'Hold', exchange: 'NYSE' },
    { ticker: 'MTCH', name: 'Match Group', price: '35.00', allocation: '0.5%', signal: 'Value Buy', exchange: 'NASDAQ' },
    { ticker: 'BMBL', name: 'Bumble Inc', price: '12.00', allocation: '0.5%', signal: 'Spec Buy', exchange: 'NASDAQ' },
    { ticker: 'CHWY', name: 'Chewy Inc', price: '20.00', allocation: '0.5%', signal: 'Spec Buy', exchange: 'NYSE' },
    { ticker: 'W', name: 'Wayfair Inc', price: '55.00', allocation: '0.5%', signal: 'Spec Buy', exchange: 'NYSE' },
  ],
  shorts: [
    { ticker: 'RIVN', name: 'Rivian Auto', price: '15.50', allocation: '4.0%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'LCID', name: 'Lucid Group', price: '3.20', allocation: '4.0%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'PTON', name: 'Peloton Inter', price: '5.80', allocation: '3.5%', signal: 'Strong Short', exchange: 'NASDAQ' },
    { ticker: 'ZM', name: 'Zoom Video', price: '68.00', allocation: '3.0%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'BYND', name: 'Beyond Meat', price: '7.50', allocation: '2.5%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'AMC', name: 'AMC Entertain', price: '4.50', allocation: '2.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'GME', name: 'GameStop Corp', price: '14.20', allocation: '2.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'NKLA', name: 'Nikola Corp', price: '0.75', allocation: '2.0%', signal: 'Strong Short', exchange: 'NASDAQ' },
    { ticker: 'SPCE', name: 'Virgin Galactic', price: '1.80', allocation: '2.0%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'CVNA', name: 'Carvana Co', price: '45.00', allocation: '2.0%', signal: 'Spec Short', exchange: 'NYSE' },
    { ticker: 'MARA', name: 'Marathon Dig', price: '20.00', allocation: '1.5%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'RIOT', name: 'Riot Platforms', price: '12.00', allocation: '1.5%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'HUT', name: 'Hut 8 Corp', price: '10.00', allocation: '1.5%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'MSTR', name: 'MicroStrategy', price: '500.00', allocation: '1.5%', signal: 'Hedge Short', exchange: 'NASDAQ' },
    { ticker: 'COIN', name: 'Coinbase', price: '125.00', allocation: '1.5%', signal: 'Hedge Short', exchange: 'NASDAQ' },
    { ticker: 'SAVA', name: 'Cassava Sci', price: '22.00', allocation: '1.0%', signal: 'Spec Short', exchange: 'NASDAQ' },
    { ticker: 'NVAX', name: 'Novavax Inc', price: '5.00', allocation: '1.0%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'MRNA', name: 'Moderna Inc', price: '90.00', allocation: '1.0%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'BABA', name: 'Alibaba Grp', price: '70.00', allocation: '1.0%', signal: 'Avoid', exchange: 'NYSE' },
    { ticker: 'JD', name: 'JD.com Inc', price: '25.00', allocation: '1.0%', signal: 'Avoid', exchange: 'NASDAQ' },
    { ticker: 'PDD', name: 'PDD Holdings', price: '140.00', allocation: '1.0%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'NIO', name: 'NIO Inc', price: '7.00', allocation: '1.0%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'XPEV', name: 'XPeng Inc', price: '10.00', allocation: '1.0%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'LI', name: 'Li Auto Inc', price: '30.00', allocation: '1.0%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'T', name: 'AT&T Inc', price: '16.00', allocation: '1.0%', signal: 'Avoid', exchange: 'NYSE' },
    { ticker: 'VZ', name: 'Verizon Comm', price: '38.00', allocation: '1.0%', signal: 'Avoid', exchange: 'NYSE' },
    { ticker: 'WBA', name: 'Walgreens', price: '22.00', allocation: '0.8%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'MMM', name: '3M Company', price: '95.00', allocation: '0.8%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'PARA', name: 'Paramount', price: '12.00', allocation: '0.8%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'WBD', name: 'Warner Bros', price: '10.00', allocation: '0.8%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'DIS', name: 'Disney', price: '90.00', allocation: '0.8%', signal: 'Avoid', exchange: 'NYSE' },
    { ticker: 'F', name: 'Ford Motor', price: '11.00', allocation: '0.8%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'GM', name: 'General Motors', price: '35.00', allocation: '0.8%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'AAL', name: 'American Air', price: '13.00', allocation: '0.5%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'UAL', name: 'United Air', price: '40.00', allocation: '0.5%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'DAL', name: 'Delta Air', price: '38.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'LUV', name: 'Southwest', price: '28.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'CCL', name: 'Carnival Corp', price: '15.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'RCL', name: 'Royal Carib', price: '120.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'NCLH', name: 'Norwegian', price: '18.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'GT', name: 'Goodyear Tire', price: '14.00', allocation: '0.5%', signal: 'Short', exchange: 'NASDAQ' },
    { ticker: 'X', name: 'US Steel', price: '45.00', allocation: '0.5%', signal: 'Avoid', exchange: 'NYSE' },
    { ticker: 'CLF', name: 'Cleveland-Cliffs', price: '18.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'AA', name: 'Alcoa Corp', price: '30.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'FCX', name: 'Freeport-McMoRan', price: '40.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'VALE', name: 'Vale SA', price: '14.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'RIO', name: 'Rio Tinto', price: '65.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'BHP', name: 'BHP Group', price: '60.00', allocation: '0.5%', signal: 'Short', exchange: 'NYSE' },
    { ticker: 'GBTC', name: 'Grayscale BTC', price: '40.00', allocation: '0.5%', signal: 'Short', exchange: 'OTC' },
    { ticker: 'EETH', name: 'Grayscale ETH', price: '25.00', allocation: '0.5%', signal: 'Short', exchange: 'OTC' },
  ]
};

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

const fetchTickerData = async (ticker) => {
  try {
    // Fetch 1 month of daily data for the chart
    // Fetch 1 month of daily data for the chart
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1mo`;
    const response = await fetchWithFallback(targetUrl);

    const data = await response.json();
    const result = data.chart.result[0];
    const quote = result.meta;

    // Process chart data
    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;

    const history = timestamps.map((time, index) => ({
      date: new Date(time * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      price: prices[index] ? parseFloat(prices[index].toFixed(2)) : null
    })).filter(item => item.price !== null);

    return {
      ticker: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      price: quote.regularMarketPrice.toFixed(2),
      change: (quote.regularMarketPrice - quote.chartPreviousClose).toFixed(2),
      changePercent: ((quote.regularMarketPrice - quote.chartPreviousClose) / quote.chartPreviousClose * 100).toFixed(2) + '%',
      volume: (quote.regularMarketVolume / 1000000).toFixed(1) + 'M',
      marketCap: 'N/A',
      peRatio: 'N/A',
      high52: quote.fiftyTwoWeekHigh ? quote.fiftyTwoWeekHigh.toFixed(2) : 'N/A',
      history: history
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};


// --- Technical Analysis Helpers ---

const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1) + 0) / period;
    } else {
      avgGain = (avgGain * (period - 1) + 0) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(diff)) / period;
    }
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

const calculateSMA = (prices, period = 20) => {
  if (prices.length < period) return null;
  const slice = prices.slice(prices.length - period);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / period;
};

const calculateShortScore = (rsi, price, sma, changePercent) => {
  let score = 0;

  // RSI Component (0-40 points)
  // High RSI = Overbought = Good for shorting
  if (rsi > 80) score += 40;
  else if (rsi > 70) score += 30;
  else if (rsi > 60) score += 15;
  else if (rsi < 30) score -= 20; // Oversold, bad for shorting

  // Trend Component (0-30 points)
  // Price below SMA = Downtrend = Good for shorting
  if (price < sma) score += 30;

  // Momentum Component (0-30 points)
  // Negative momentum is good for existing shorts
  const change = parseFloat(changePercent);
  if (change < -2) score += 30;
  else if (change < 0) score += 15;
  else if (change > 2) score -= 10; // Strong upward momentum is risky

  return Math.max(0, Math.min(100, score));
};

const calculateBeta = (stockPrices, marketPrices) => {
  if (!stockPrices || !marketPrices || stockPrices.length < 30 || marketPrices.length < 30) return 1.0;

  // Align dates (assuming same interval and range, arrays should be roughly same length/aligned)
  // For simplicity in this MVP, we assume the arrays are aligned by index from the end (most recent)
  // A more robust solution would match by timestamp

  const len = Math.min(stockPrices.length, marketPrices.length);
  const stock = stockPrices.slice(-len);
  const market = marketPrices.slice(-len);

  const stockReturns = [];
  const marketReturns = [];

  for (let i = 1; i < len; i++) {
    stockReturns.push((stock[i] - stock[i - 1]) / stock[i - 1]);
    marketReturns.push((market[i] - market[i - 1]) / market[i - 1]);
  }

  const meanStock = stockReturns.reduce((a, b) => a + b, 0) / stockReturns.length;
  const meanMarket = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length;

  let covariance = 0;
  let variance = 0;

  for (let i = 0; i < stockReturns.length; i++) {
    covariance += (stockReturns[i] - meanStock) * (marketReturns[i] - meanMarket);
    variance += (marketReturns[i] - meanMarket) ** 2;
  }

  return variance === 0 ? 1.0 : covariance / variance;
};

const formatMarketCap = (marketCap) => {
  if (!marketCap) return 'N/A';
  if (marketCap >= 1e12) return (marketCap / 1e12).toFixed(2) + 'T';
  if (marketCap >= 1e9) return (marketCap / 1e9).toFixed(2) + 'B';
  if (marketCap >= 1e6) return (marketCap / 1e6).toFixed(2) + 'M';
  return marketCap.toLocaleString();
};

const fetchSpyData = async () => {
  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=3mo`;
  const proxies = [
    `https://corsproxy.io/?${targetUrl}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
  ];

  for (const url of proxies) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.chart.result[0].indicators.quote[0].close;
      }
      console.warn(`SPY fetch failed for ${url}: ${response.status}`);
    } catch (e) {
      console.warn(`SPY fetch error for ${url}:`, e);
    }
  }
  console.error("Failed to fetch SPY data from all sources for Beta calculation");
  return [];
};

const fetchSimpleQuote = async (ticker, spyPrices = []) => {
  try {
    // Fetch chart data
    const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=3mo`;
    const response = await fetchWithFallback(chartUrl);

    const data = await response.json();
    const result = data.chart.result[0];
    const quote = result.meta;
    const prices = result.indicators.quote[0].close;

    // Calculate Indicators
    const cleanPrices = prices.filter(p => p !== null);
    const currentPrice = quote.regularMarketPrice || 0;

    const rsi = calculateRSI(cleanPrices);
    const sma20 = calculateSMA(cleanPrices, 20);
    const shortScore = (rsi && sma20) ? calculateShortScore(rsi, currentPrice, sma20, quote.regularMarketChangePercent) : null;

    // Calculate Beta
    const beta = calculateBeta(cleanPrices, spyPrices);

    return {
      price: currentPrice.toFixed(2),
      change: (currentPrice - quote.chartPreviousClose).toFixed(2),
      changePercent: ((currentPrice - quote.chartPreviousClose) / quote.chartPreviousClose * 100).toFixed(2) + '%',
      marketCap: formatMarketCap(quote.marketCap),
      high52: quote.fiftyTwoWeekHigh,
      low52: quote.fiftyTwoWeekLow,
      rsi: rsi ? rsi.toFixed(1) : 'N/A',
      sma20: sma20 ? sma20.toFixed(2) : 'N/A',
      shortScore: shortScore ? Math.round(shortScore) : 'N/A',
      beta: beta.toFixed(2)
    };
  } catch (error) {
    console.error(`Error fetching quote for ${ticker}:`, error);
    return null;
  }
};

// --- AI Analysis Mock ---
// --- AI Analysis Logic ---
const generateAIInsight = async (data) => {
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

// --- Components ---

const PriceChart = ({ data, isPositive, isDark }) => {
  if (!data || data.length === 0) return null;

  const color = isPositive ? '#10b981' : '#f43f5e'; // emerald-500 or rose-500
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['auto', 'auto']}
            hide={true}
          />
          <Tooltip
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText }}
            itemStyle={{ color: tooltipText }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorPrice)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const MacroCard = ({ label, value, change, isPositive }) => {
  // Special logic for VIX and Yield: Lower is usually "good" for stocks (green), higher is "bad" (red)
  // But for the dashboard display, we usually just color code the change itself.
  // Actually, standard financial dashboards usually color change: Green if price went up, Red if price went down.

  const isUp = change.includes('+');
  const colorClass = isUp ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none">
      <div className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</div>
      <div className="flex items-end justify-between mt-1">
        <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</span>
        <span className={`text-sm font-medium ${colorClass} flex items-center`}>
          {isUp ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          {change}
        </span>
      </div>
    </div>
  );
};

const RiskDashboard = ({ opportunities, investmentAmount }) => {
  const longs = opportunities['conviction'] || [];
  const shorts = opportunities['shorts'] || [];

  const calculateExposure = (list) => list.reduce((acc, item) => acc + parseFloat(item.allocation), 0);
  const calculateBetaExposure = (list) => list.reduce((acc, item) => acc + (parseFloat(item.allocation) * (parseFloat(item.beta) || 1)), 0);

  const calculatePnL = (list, type) => list.reduce((acc, item) => {
    const positionValue = (investmentAmount * parseFloat(item.allocation)) / 100;
    const change = parseFloat(item.changePercent);
    // For shorts, price drop is positive P&L
    const pnl = type === 'short' ? positionValue * (change * -1 / 100) : positionValue * (change / 100);
    return acc + pnl;
  }, 0);

  const longExposure = calculateExposure(longs);
  const shortExposure = calculateExposure(shorts);
  const netExposure = longExposure - shortExposure;
  const grossExposure = longExposure + shortExposure;

  const longBetaExp = calculateBetaExposure(longs);
  const shortBetaExp = calculateBetaExposure(shorts);
  const netBetaExposure = longBetaExp - shortBetaExp;

  const longPnL = calculatePnL(longs, 'long');
  const shortPnL = calculatePnL(shorts, 'short');
  const totalPnL = longPnL + shortPnL;
  const totalPnLPercent = (totalPnL / investmentAmount) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-none">
        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Net Exposure</div>
        <div className={`text-2xl font-bold ${netExposure > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {netExposure > 0 ? '+' : ''}{netExposure.toFixed(1)}%
        </div>
        <div className="text-xs text-slate-400 mt-1 flex justify-between">
          <span>Beta Adj:</span>
          <span className={`${netBetaExposure > 0 ? 'text-emerald-500' : 'text-rose-500'} font-bold`}>
            {netBetaExposure > 0 ? '+' : ''}{netBetaExposure.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-none">
        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Daily P&L</div>
        <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {totalPnL >= 0 ? '+' : ''}${Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </div>
        <div className={`text-xs font-medium mt-1 ${totalPnLPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm dark:shadow-none col-span-2">
        <div className="flex justify-between items-center mb-3">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Exposure Balance</div>
          <div className="text-xs font-mono text-slate-400">Gross: {grossExposure.toFixed(1)}%</div>
        </div>
        <div className="flex items-center gap-2 h-8">
          <div
            className="h-full bg-emerald-500/20 border border-emerald-500/50 rounded-l-lg flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-all duration-500 relative group"
            style={{ width: `${(longExposure / grossExposure) * 100}%` }}
          >
            Long {longExposure.toFixed(1)}%
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Est. P&L: ${longPnL.toFixed(0)}
            </div>
          </div>
          <div
            className="h-full bg-rose-500/20 border border-rose-500/50 rounded-r-lg flex items-center justify-center text-xs font-bold text-rose-600 dark:text-rose-400 transition-all duration-500 relative group"
            style={{ width: `${(shortExposure / grossExposure) * 100}%` }}
          >
            Short {shortExposure.toFixed(1)}%
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Est. P&L: ${shortPnL.toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const TradeGenerator = ({ opportunities, investmentAmount, setInvestmentAmount }) => {
  const [accountNumber, setAccountNumber] = useState('');

  const generateTrades = () => {
    const trades = [];

    // Process Longs (Conviction)
    if (opportunities['conviction']) {
      opportunities['conviction'].forEach(item => {
        const allocationAmount = (investmentAmount * parseFloat(item.allocation)) / 100;
        const targetQty = Math.floor(allocationAmount / parseFloat(item.price));
        const currentQty = item.currentQty || 0;
        const diff = targetQty - currentQty;

        if (diff !== 0) {
          trades.push({
            action: diff > 0 ? 'Buy' : 'Sell',
            quantity: Math.abs(diff),
            symbol: item.ticker,
            priceType: 'Limit',
            limitPrice: item.price,
            securityType: 'Equity',
            allocation: item.allocation,
            reason: diff > 0 ? `Target ${targetQty} > Current ${currentQty}` : `Target ${targetQty} < Current ${currentQty}`
          });
        }
      });
    }

    // Process Shorts
    if (opportunities['shorts']) {
      opportunities['shorts'].forEach(item => {
        const allocationAmount = (investmentAmount * parseFloat(item.allocation)) / 100;
        const targetQty = Math.floor(allocationAmount / parseFloat(item.price));
        const currentQty = item.currentQty || 0;
        const diff = targetQty - currentQty;

        if (diff !== 0) {
          trades.push({
            action: diff > 0 ? 'Sell Short' : 'Buy to Cover',
            quantity: Math.abs(diff),
            symbol: item.ticker,
            priceType: 'Limit',
            limitPrice: item.price,
            securityType: 'Equity',
            allocation: item.allocation,
            reason: diff > 0 ? `Target ${targetQty} > Current ${currentQty}` : `Target ${targetQty} < Current ${currentQty}`
          });
        }
      });
    }

    return trades;
  };

  const trades = generateTrades();

  const downloadCSV = () => {
    // CSV Header for Schwab
    // Required: Account, Action, Quantity, Symbol, Price Type, Limit Price, Security Type
    const headers = ['Account', 'Action', 'Quantity', 'Symbol', 'Price Type', 'Limit Price', 'Security Type'];

    const csvRows = [
      headers.join(','),
      ...trades.map(trade => [
        accountNumber || 'ACCOUNT',
        trade.action,
        trade.quantity,
        trade.symbol,
        trade.priceType,
        trade.limitPrice,
        trade.securityType
      ].join(','))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `schwab_trades_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-emerald-500" />
            Investment Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Total Investment Amount ($)
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Schwab Account Number (Optional)
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number for CSV"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-none flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Summary</h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Total Trades:</span>
                <span className="font-medium text-slate-900 dark:text-white">{trades.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Capital Deployed:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  ${trades.reduce((acc, t) => acc + (t.quantity * parseFloat(t.limitPrice)), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={downloadCSV}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={18} />
            Download Schwab CSV
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all data? This will clear your current quantities and allocations.')) {
                localStorage.removeItem('opportunities_v2');
                window.location.reload();
              }
            }}
            className="w-full mt-3 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw size={18} />
            Reset All Data
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <FileText size={18} className="text-slate-500" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Trade Preview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Symbol</th>
                <th className="px-6 py-3 font-medium">Quantity</th>
                <th className="px-6 py-3 font-medium">Limit Price</th>
                <th className="px-6 py-3 font-medium text-right">Est. Value</th>
                <th className="px-6 py-3 font-medium text-right">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {trades.map((trade, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${trade.action === 'Buy'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                      {trade.action}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-900 dark:text-slate-200">{trade.symbol}</td>
                  <td className="px-6 py-3 font-mono text-slate-600 dark:text-slate-400">{trade.quantity}</td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-400">${trade.limitPrice}</td>
                  <td className="px-6 py-3 text-right font-medium text-slate-900 dark:text-slate-200">
                    ${(trade.quantity * parseFloat(trade.limitPrice)).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-right text-xs text-slate-500 dark:text-slate-400">
                    {trade.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DefinitionsSection = () => {
  return (
    <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Metric Definitions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-2 flex items-center gap-2">
            <PieChart size={16} className="text-indigo-500" />
            Portfolio Exposure
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Net Exposure</strong>: (Longs - Shorts). Positive means you are Long the market.
            <br />
            <strong>Gross Exposure</strong>: (Longs + Shorts). Total leverage deployed.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-2 flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-500" />
            Day Contrib %
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            How much this position added/subtracted from your total portfolio today.
            <br />
            <em>Formula: Allocation % × Daily Change %</em>
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-2 flex items-center gap-2">
            <ShieldAlert size={16} className="text-rose-500" />
            Risk Levels
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Stop Loss</strong> (<span className="text-rose-500">Red</span>): Price to exit to limit loss.
            <br />
            <strong>Target</strong> (<span className="text-emerald-500">Green</span>): Price to take profit.
          </p>
        </div>
      </div>
    </div>
  );
};

const OpportunityTable = ({ data, type, onAllocationChange, onQuantityChange, investmentAmount }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'allocation', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Helper to parse numeric values
    const parseVal = (val, key) => {
      if (key === 'price' || key === 'change' || key === 'allocation' || key === 'currentQty' || key === 'beta') return parseFloat(val || 0);
      if (key === 'changePercent') return parseFloat(val);
      if (key === 'value') return (parseFloat(val.allocation) * investmentAmount) / 100;
      if (key === 'pnl') {
        const posVal = (parseFloat(val.allocation) * investmentAmount) / 100;
        const change = parseFloat(val.changePercent);
        return type === 'shorts' ? posVal * (change * -1 / 100) : posVal * (change / 100);
      }
      return val;
    };

    // Custom sort logic for calculated fields
    if (sortConfig.key === 'value') {
      aValue = (parseFloat(a.allocation) * investmentAmount) / 100;
      bValue = (parseFloat(b.allocation) * investmentAmount) / 100;
    } else if (sortConfig.key === 'pnl') {
      const aPos = (parseFloat(a.allocation) * investmentAmount) / 100;
      const bPos = (parseFloat(b.allocation) * investmentAmount) / 100;
      const aChange = parseFloat(a.changePercent);
      const bChange = parseFloat(b.changePercent);
      aValue = type === 'shorts' ? aPos * (aChange * -1 / 100) : aPos * (aChange / 100);
      bValue = type === 'shorts' ? bPos * (bChange * -1 / 100) : bPos * (bChange / 100);
    } else {
      aValue = parseVal(a, sortConfig.key); // Pass the whole item for 'value' and 'pnl'
      bValue = parseVal(b, sortConfig.key); // Pass the whole item for 'value' and 'pnl'
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <div className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-30">▼</div>;
    return sortConfig.direction === 'asc'
      ? <div className="w-3 h-3 ml-1 text-indigo-500">▲</div>
      : <div className="w-3 h-3 ml-1 text-indigo-500">▼</div>;
  };

  const HeaderCell = ({ label, column, align = 'left' }) => (
    <th
      className={`pb-2 font-medium cursor-pointer group select-none ${align === 'right' ? 'text-right' : 'text-left'}`}
      onClick={() => handleSort(column)}
    >
      <div className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        <SortIcon column={column} />
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider">
            <HeaderCell label="Ticker" column="ticker" />
            <HeaderCell label="Price" column="price" />
            <HeaderCell label="Beta" column="beta" />
            <HeaderCell label="Current Qty" column="currentQty" />
            <HeaderCell label="$ Value" column="value" />
            <th className="pb-2 font-medium text-left">Risk Levels</th>
            <th className="pb-2 font-medium text-right">Signal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {sortedData.map((item, idx) => {
            const positionValue = (parseFloat(item.allocation) * investmentAmount) / 100;
            const change = parseFloat(item.changePercent);
            const pnl = type === 'shorts' ? positionValue * (change * -1 / 100) : positionValue * (change / 100);

            return (
              <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 font-bold text-slate-900 dark:text-slate-200">
                  <a
                    href={`https://www.google.com/finance/quote/${item.ticker}:${item.exchange === 'OTC' ? 'OTCMKTS' : item.exchange}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline decoration-indigo-500/30 underline-offset-2 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.ticker}
                  </a>
                  <div className="text-xs text-slate-500 font-normal">{item.name}</div>
                </td>
                <td className="py-3 text-slate-700 dark:text-slate-300">
                  ${item.price}
                  {item.high52 && item.low52 ? (
                    <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 relative">
                      {/* Range Bar */}
                      <div
                        className="absolute top-0 bottom-0 bg-indigo-500/30 rounded-full"
                        style={{
                          left: '0%',
                          right: '0%'
                        }}
                      />
                      {/* Current Price Marker */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-sm border border-white dark:border-slate-900"
                        style={{
                          left: `${Math.min(100, Math.max(0, ((parseFloat(item.price) - item.low52) / (item.high52 - item.low52)) * 100))}%`
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`text-xs ${parseFloat(item.change) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.changePercent}
                    </div>
                  )}
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-400 text-xs font-medium">
                  {item.beta || '1.00'}
                </td>
                <td className="py-3">
                  <input
                    type="number"
                    value={item.currentQty || 0}
                    onChange={(e) => onQuantityChange(item.ticker, e.target.value)}
                    className="w-16 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 rounded text-center outline-none transition-all font-mono text-slate-700 dark:text-slate-300"
                    min="0"
                  />
                </td>
                <td className="py-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                  ${positionValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </td>
                <td className="py-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-[10px] text-rose-500">
                      <ShieldAlert size={10} />
                      <span>
                        {type === 'conviction'
                          ? (parseFloat(item.price) * 0.95).toFixed(2)
                          : (parseFloat(item.price) * 1.05).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-500">
                      <Target size={10} />
                      <span>
                        {type === 'conviction'
                          ? (parseFloat(item.price) * 1.15).toFixed(2)
                          : (parseFloat(item.price) * 0.85).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${type === 'conviction' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                    'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    }`}>
                    {item.signal}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('conviction');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem('opportunities_v2');
    return saved ? JSON.parse(saved) : OPPORTUNITY_DATA;
  });

  useEffect(() => {
    localStorage.setItem('opportunities_v2', JSON.stringify(opportunities));
  }, [opportunities]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAllocationChange = (ticker, newAllocation) => {
    setOpportunities(prev => {
      const updated = { ...prev };
      // Update in both lists to be safe, though usually a ticker is in one
      ['conviction', 'shorts'].forEach(key => {
        if (updated[key]) {
          updated[key] = updated[key].map(item =>
            item.ticker === ticker ? { ...item, allocation: newAllocation } : item
          );
        }
      });
      return updated;
    });
  };

  const handleQuantityChange = (ticker, newQty) => {
    setOpportunities(prev => {
      const updated = { ...prev };
      ['conviction', 'shorts'].forEach(key => {
        if (updated[key]) {
          updated[key] = updated[key].map(item =>
            item.ticker === ticker ? { ...item, currentQty: parseInt(newQty) || 0 } : item
          );
        }
      });
      return updated;
    });
  };

  const refreshPrices = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    // Fetch SPY data first for Beta calculation
    const spyPrices = await fetchSpyData();

    // Create a deep copy to avoid mutating state directly
    const currentList = opportunities[activeTab] || [];
    const updatedList = currentList.map(item => ({ ...item }));

    for (let i = 0; i < currentList.length; i += batchSize) {
      const batch = currentList.slice(i, i + batchSize);
      const promises = batch.map(async (item, batchIdx) => {
        const quote = await fetchSimpleQuote(item.ticker, spyPrices);
        if (quote) {
          updatedList[i + batchIdx] = { ...item, ...quote };
        }
      });
      await Promise.all(promises);

      // Update state incrementally
      setOpportunities(prev => ({
        ...prev,
        [activeTab]: [...updatedList]
      }));
    }

    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshPrices();
    const interval = setInterval(refreshPrices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [activeTab]);

  const performSearch = async () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      setError(null);
      setSearchResult(null);
      setAiAnalysis(null);

      const data = await fetchTickerData(searchQuery.toUpperCase());

      if (data) {
        setSearchResult(data);
      } else {
        setError('Ticker not found or API error. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const closeSearch = () => {
    setSearchResult(null);
    setSearchQuery('');
    setError(null);
    setAiAnalysis(null);
  };

  const runAiAnalysis = async () => {
    if (!searchResult) return;
    setIsAnalyzing(true);
    const insight = await generateAIInsight(searchResult);
    setAiAnalysis(insight);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 md:p-6 font-sans selection:bg-indigo-500/30 relative transition-colors duration-300">

      {/* Search Modal Overlay */}
      {(searchResult || isLoading || error) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  {isLoading ? (
                    <div className="h-8 w-32 bg-slate-800 rounded animate-pulse mb-2"></div>
                  ) : error ? (
                    <h2 className="text-xl font-bold text-rose-400 tracking-tight">Error</h2>
                  ) : (

                    <>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{searchResult.ticker}</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{searchResult.name}</p>
                    </>
                  )}
                </div>
                <button
                  onClick={closeSearch}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-10 w-48 bg-slate-800 rounded animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-slate-300 mb-4">
                  {error}. Please try another ticker.
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">${searchResult.price}</span>
                    <span className={`text-lg font-medium flex items-center ${parseFloat(searchResult.change) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {parseFloat(searchResult.change) >= 0 ? <ArrowUpRight size={20} className="mr-1" /> : <ArrowDownRight size={20} className="mr-1" />}
                      {parseFloat(searchResult.change) >= 0 ? '+' : ''}{searchResult.change} ({searchResult.changePercent})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Volume</div>
                      <div className="text-slate-900 dark:text-slate-200 font-mono text-sm">{searchResult.volume}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Market Cap</div>
                      <div className="text-slate-900 dark:text-slate-200 font-mono text-sm">{searchResult.marketCap}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">P/E Ratio</div>
                      <div className="text-slate-900 dark:text-slate-200 font-mono text-sm">{searchResult.peRatio}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">52W High</div>
                      <div className="text-slate-900 dark:text-slate-200 font-mono text-sm">{searchResult.high52}</div>
                    </div>
                  </div>

                  {/* Price Chart */}
                  <div className="mb-6 bg-slate-50 dark:bg-slate-950/30 rounded-xl border border-slate-200 dark:border-slate-800/50 p-2">
                    <div className="text-xs text-slate-500 font-medium px-2 pt-2">1 Month Price History</div>
                    <PriceChart data={searchResult.history} isPositive={parseFloat(searchResult.change) >= 0} isDark={theme === 'dark'} />
                  </div>

                  {/* AI Analysis Section */}
                  <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BrainCircuit size={18} className="text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">AI Analyst Insight</h3>
                      </div>
                      {!aiAnalysis && !isAnalyzing && (
                        <button
                          onClick={runAiAnalysis}
                          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Sparkles size={12} />
                          Generate Analysis
                        </button>
                      )}
                    </div>

                    {isAnalyzing ? (
                      <div className="flex items-center gap-3 text-indigo-300/70 py-2">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm animate-pulse">Analyzing market patterns...</span>
                      </div>
                    ) : aiAnalysis ? (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="text-sm text-indigo-900/90 dark:text-indigo-200/90 leading-relaxed">
                          {aiAnalysis}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-indigo-500/70 dark:text-indigo-300/50 italic">
                        Click generate to get an AI-powered technical and fundamental breakdown of {searchResult.ticker}.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {!isLoading && !error && (
              <div className="bg-slate-50 dark:bg-slate-950/80 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-500">Real-time data delayed by 15 mins</span>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  Trade {searchResult.ticker}
                </button>
              </div>
            )}
          </div>
        </div >
      )
      }

      {/* Header / Macro Strip */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Activity size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Market<span className="text-indigo-600 dark:text-indigo-400">Pulse</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <button
                onClick={performSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-500 transition-colors"
              >
                <Search size={16} />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search ticker..."
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
            <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <AlertTriangle size={18} className="text-slate-500 dark:text-slate-400" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-100 dark:border-slate-950 ring-2 ring-slate-200 dark:ring-slate-800">
              BD
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MACRO_DATA.map((item, idx) => (
            <MacroCard key={idx} {...item} />
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Risk Dashboard */}
        <div className="lg:col-span-12">
          <RiskDashboard opportunities={opportunities} investmentAmount={investmentAmount} />
        </div>

        {/* Center Column: Opportunity Scanner */}
        <div className="lg:col-span-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm dark:shadow-none">
            <div className="border-b border-slate-200 dark:border-slate-800 px-4 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-amber-500 dark:text-amber-400" />
                  <h2 className="font-semibold text-slate-900 dark:text-white">Opportunity Scanner</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 hidden sm:inline-block">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                  <button
                    onClick={refreshPrices}
                    disabled={isRefreshing}
                    className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isRefreshing ? 'animate-spin text-indigo-500' : 'text-slate-400 hover:text-indigo-500'}`}
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
              <div className="flex gap-6">
                {['conviction', 'shorts', 'generator'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-colors relative ${activeTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                  >
                    {tab === 'generator' ? 'Trade Generator' : tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-500 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'generator' ? (
              <div className="p-4 flex-1 overflow-y-auto">
                <TradeGenerator
                  opportunities={opportunities}
                  investmentAmount={investmentAmount}
                  setInvestmentAmount={setInvestmentAmount}
                />
              </div>
            ) : (
              <>
                <div className="p-4 flex-1 overflow-y-auto">
                  <OpportunityTable
                    data={opportunities[activeTab]}
                    type={activeTab}
                    onAllocationChange={handleAllocationChange}
                    onQuantityChange={handleQuantityChange}
                    investmentAmount={investmentAmount}
                  />
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-t border-slate-200 dark:border-slate-800 text-center">
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors">
                    View All Results
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </main>

      <DefinitionsSection />
    </div >
  );
}

export default App;
