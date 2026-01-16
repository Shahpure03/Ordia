/**
 * ProgressChart Component
 * Area chart showing daily completion percentage over time
 * Replaced with Recharts implementation as requested
 */

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";
import type { OrdiaaStateHook } from "@/hooks/useOrdiaState";
import { cn } from "@/lib/utils";

interface ProgressChartProps {
    getCompletionHistory: OrdiaaStateHook["getCompletionHistory"];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-sm text-purple-600 font-bold">
                    {payload[0].value}% Completed
                </p>
            </div>
        );
    }
    return null;
};

export function ProgressChart({ getCompletionHistory }: ProgressChartProps) {
    // Get last 14 days of completion data
    // User asked for "Last 6 months" in example text, but daily tracking for 6 months is too dense.
    // We'll stick to 30 days for a readable chart in this widget size.
    const data = useMemo(() => getCompletionHistory(30), [getCompletionHistory]);

    // Calculate trend (simple comparison of first vs last half average)
    const trend = useMemo(() => {
        if (data.length < 2) return 0;
        const mid = Math.floor(data.length / 2);
        const firstHalf = data.slice(0, mid);
        const secondHalf = data.slice(mid);
        const avg1 = firstHalf.reduce((sum, d) => sum + d.rate, 0) / firstHalf.length || 0;
        const avg2 = secondHalf.reduce((sum, d) => sum + d.rate, 0) / secondHalf.length || 0;
        const diff = avg2 - avg1;
        return Number(diff.toFixed(1));
    }, [data]);

    return (

        <div className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 sm:p-6 pb-2">
                <h3 className="text-lg font-medium text-gray-700 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span>📈</span>
                        Progress
                    </span>
                    <span className="text-sm text-gray-400 font-normal">Last 30 Days</span>
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Your daily habit completion rates
                </p>
            </div>

            <div className="p-4 sm:p-6 pt-0 w-full" style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 10,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#a855f7" // Purple-500
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#a855f7"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            interval="preserveStartEnd"
                            minTickGap={30}
                        />
                        <YAxis
                            hide
                            domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d8b4fe', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            dataKey="rate"
                            type="monotone"
                            fill="url(#fillRate)"
                            fillOpacity={0.4}
                            stroke="#a855f7"
                            strokeWidth={2}
                            stackId="a"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="p-4 sm:p-6 pt-0">
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-1">
                        <div className="flex items-center gap-2 leading-none font-medium text-gray-700">
                            {trend > 0 ? "Trending up" : "Trending down"} by {Math.abs(trend)}% this period
                            <TrendingUp className={cn("h-4 w-4", trend < 0 && "text-red-500 rotate-180", trend >= 0 && "text-green-500")} />
                        </div>
                        <div className="text-gray-400 text-xs flex items-center gap-2 leading-none">
                            Keep consistent to improve your score
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
