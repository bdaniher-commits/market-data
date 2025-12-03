import React from 'react';
import { BookOpen, PieChart, DollarSign, ShieldAlert } from 'lucide-react';

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

export default DefinitionsSection;
