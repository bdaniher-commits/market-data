import React, { useState } from 'react';
import { DollarSign, Download, RotateCcw, FileText } from 'lucide-react';

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
                    // Primary Trade
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

                    // Target Exit Trade (Only for new positions/adds)
                    if (diff > 0) {
                        trades.push({
                            action: 'Sell',
                            quantity: Math.abs(diff),
                            symbol: item.ticker,
                            priceType: 'Limit',
                            limitPrice: (parseFloat(item.price) * 1.15).toFixed(2), // +15% Target
                            securityType: 'Equity',
                            allocation: item.allocation,
                            reason: 'Take Profit Target (+15%)'
                        });
                    }
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
                    // Primary Trade
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

                    // Target Exit Trade (Only for new positions/adds)
                    if (diff > 0) {
                        trades.push({
                            action: 'Buy to Cover',
                            quantity: Math.abs(diff),
                            symbol: item.ticker,
                            priceType: 'Limit',
                            limitPrice: (parseFloat(item.price) * 0.85).toFixed(2), // -15% Target
                            securityType: 'Equity',
                            allocation: item.allocation,
                            reason: 'Take Profit Target (-15%)'
                        });
                    }
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

export default TradeGenerator;
