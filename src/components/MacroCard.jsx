import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MacroCard = ({ label, value, change }) => {
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

export default MacroCard;
