import React from 'react';

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

export default RiskDashboard;
