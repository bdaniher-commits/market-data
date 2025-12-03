import React, { useState } from 'react';
import { ShieldAlert, Target } from 'lucide-react';


const SortIcon = ({ column, sortConfig }) => {
    if (sortConfig.key !== column) return <div className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-30">▼</div>;
    return sortConfig.direction === 'asc'
        ? <div className="w-3 h-3 ml-1 text-indigo-500">▲</div>
        : <div className="w-3 h-3 ml-1 text-indigo-500">▼</div>;
};

const HeaderCell = ({ label, column, align = 'left', sortConfig, handleSort }) => (
    <th
        className={`pb-2 font-medium cursor-pointer group select-none bg-white dark:bg-slate-900 z-10 ${align === 'right' ? 'text-right' : 'text-left'}`}
        onClick={() => handleSort(column)}
        style={{ width: column === 'ticker' ? '20%' : 'auto' }}
    >
        <div className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
            {label}
            <SortIcon column={column} sortConfig={sortConfig} />
        </div>
    </th>
);

const OpportunityTable = ({ data, type, onQuantityChange, investmentAmount }) => {
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

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-slate-500 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider bg-white dark:bg-slate-900 sticky top-0 z-10">
                        <HeaderCell label="Ticker" column="ticker" sortConfig={sortConfig} handleSort={handleSort} />
                        <HeaderCell label="Price" column="price" sortConfig={sortConfig} handleSort={handleSort} />
                        <HeaderCell label="Beta" column="beta" sortConfig={sortConfig} handleSort={handleSort} />
                        <HeaderCell label="Current Qty" column="currentQty" sortConfig={sortConfig} handleSort={handleSort} />
                        <HeaderCell label="$ Value" column="value" sortConfig={sortConfig} handleSort={handleSort} />
                        <th className="pb-2 font-medium text-left bg-white dark:bg-slate-900">Risk Levels</th>
                        <th className="pb-2 font-medium text-right bg-white dark:bg-slate-900">Signal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {sortedData.map((item, idx) => {
                        const positionValue = (parseFloat(item.allocation) * investmentAmount) / 100;

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
                                            <div
                                                className="absolute top-0 bottom-0 bg-indigo-500/30 rounded-full"
                                                style={{
                                                    left: '0%',
                                                    right: '0%'
                                                }}
                                            />
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

export default OpportunityTable;
