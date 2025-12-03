import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

export default PriceChart;
