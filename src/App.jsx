import React, { useState, useEffect } from 'react';
import {
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
  RefreshCw
} from 'lucide-react';

import { MACRO_DATA, OPPORTUNITY_DATA } from './data/constants';
import { fetchDailyOpportunities, fetchSpyData, fetchSimpleQuote, fetchTickerData } from './utils/api';
import { generateAIInsight } from './utils/ai';

import PriceChart from './components/PriceChart';
import MacroCard from './components/MacroCard';
import RiskDashboard from './components/RiskDashboard';
import TradeGenerator from './components/TradeGenerator';
import DefinitionsSection from './components/DefinitionsSection';
import OpportunityTable from './components/OpportunityTable';

import { useQuery } from '@tanstack/react-query';

function App() {
  const [activeTab, setActiveTab] = useState('conviction');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  // Theme Effect
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

  // 1. Fetch Daily Opportunities (Base List)
  const { data: baseOpportunities = { conviction: [], shorts: [] } } = useQuery({
    queryKey: ['opportunities', 'daily'],
    queryFn: fetchDailyOpportunities,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // 2. Fetch SPY Data (for Beta)
  const { data: spyPrices } = useQuery({
    queryKey: ['spy'],
    queryFn: fetchSpyData,
    staleTime: 1000 * 60 * 60, // 1 hour
    initialData: []
  });

  // 3. Fetch Live Prices for Active Tab
  const { data: opportunities = { conviction: [], shorts: [] }, isFetching: isRefreshing, refetch: refreshPrices, dataUpdatedAt } = useQuery({
    queryKey: ['opportunities', 'live', activeTab],
    queryFn: async () => {
      const currentList = baseOpportunities?.[activeTab] || [];
      if (currentList.length === 0) return baseOpportunities || { conviction: [], shorts: [] };

      // Batch fetch updates
      const batchSize = 15;
      const updates = [];

      for (let i = 0; i < currentList.length; i += batchSize) {
        const batch = currentList.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(async (item) => {
          const quote = await fetchSimpleQuote(item.ticker, spyPrices);
          return quote ? { ticker: item.ticker, ...quote } : null;
        }));
        updates.push(...batchResults);

        // Small delay between batches
        if (i + batchSize < currentList.length) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      const updateMap = new Map(updates.filter(u => u).map(u => [u.ticker, u]));

      // Merge updates into base list
      const mergedList = currentList.map(item => {
        if (updateMap.has(item.ticker)) {
          return { ...item, ...updateMap.get(item.ticker) };
        }
        return item;
      });

      return {
        ...baseOpportunities,
        [activeTab]: mergedList
      };
    },
    // Only run if we have base data and active tab is a list (not generator)
    enabled: !!baseOpportunities?.[activeTab] && activeTab !== 'generator',
    refetchInterval: 60000, // Refresh every minute
  });

  // Local state for quantity adjustments (merged with query data for display)
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (ticker, newQty) => {
    setQuantities(prev => ({
      ...prev,
      [ticker]: parseInt(newQty) || 0
    }));
  };

  // Merge quantities into display data
  // Use opportunities (live data) if available, otherwise fall back to baseOpportunities
  const currentData = opportunities || baseOpportunities || { conviction: [], shorts: [] };

  const displayOpportunities = {
    conviction: (currentData?.conviction || []).map(item => ({ ...item, currentQty: quantities[item.ticker] ?? item.currentQty ?? 0 })),
    shorts: (currentData?.shorts || []).map(item => ({ ...item, currentQty: quantities[item.ticker] ?? item.currentQty ?? 0 }))
  };



  const performSearch = async () => {
    if (searchQuery.trim()) {
      setIsLoadingSearch(true);
      setSearchError(null);
      setSearchResult(null);
      setAiAnalysis(null);

      const data = await fetchTickerData(searchQuery.toUpperCase());

      if (data) {
        setSearchResult(data);
      } else {
        setSearchError('Ticker not found or API error. Please try again.');
      }
      setIsLoadingSearch(false);
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
    setSearchError(null);
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
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-500/30 relative transition-colors duration-300 flex flex-col overflow-hidden">

      {/* Search Modal Overlay */}
      {(searchResult || isLoadingSearch || searchError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  {isLoadingSearch ? (
                    <div className="h-8 w-32 bg-slate-800 rounded animate-pulse mb-2"></div>
                  ) : searchError ? (
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

              {isLoadingSearch ? (
                <div className="space-y-4">
                  <div className="h-10 w-48 bg-slate-800 rounded animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
                  </div>
                </div>
              ) : searchError ? (
                <div className="text-slate-300 mb-4">
                  {searchError}. Please try another ticker.
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

            {!isLoadingSearch && !searchError && (
              <div className="bg-slate-50 dark:bg-slate-950/80 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-500">Real-time data delayed by 15 mins</span>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  Trade {searchResult.ticker}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Risk Dashboard */}
          <div className="lg:col-span-12 shrink-0">
            <RiskDashboard opportunities={opportunities} investmentAmount={investmentAmount} />
          </div>

          {/* Center Column: Opportunity Scanner */}
          <div className="lg:col-span-12 flex flex-col min-h-0">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm dark:shadow-none">
              <div className="border-b border-slate-200 dark:border-slate-800 px-4 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap size={18} className="text-amber-500 dark:text-amber-400" />
                    <h2 className="font-semibold text-slate-900 dark:text-white">Opportunity Scanner</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 hidden sm:inline-block">
                      Prices: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Loading...'}
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
                  <div className="flex-1 overflow-hidden">
                    <OpportunityTable
                      data={displayOpportunities[activeTab]}
                      type={activeTab}
                      onQuantityChange={handleQuantityChange}
                      investmentAmount={investmentAmount}
                    />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/50 p-3 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
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
      </div>
    </div>
  );
}

export default App;
