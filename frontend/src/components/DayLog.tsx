/**
 * DayLog Component
 * Simple one-line text input for daily journal/log entries
 * Shows entries for the past few days
 */

import { useState } from "react";

import { formatDate } from "@/lib/storage";
import type { OrdiaaStateHook } from "@/hooks/useOrdiaState";

interface DayLogProps {
    updateLog: OrdiaaStateHook["updateLog"];
    getLog: OrdiaaStateHook["getLog"];
    selectedDate: Date;
}

export function DayLog({ updateLog, getLog, selectedDate }: DayLogProps) {
    const isToday = formatDate(selectedDate) === formatDate(new Date());

    return (
        <div className="mb-8 border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
            <div className="p-6 pb-4">
                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                    <span>✍️</span>
                    Daily Log
                    <span className="text-sm font-normal text-gray-400 ml-auto">
                        {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                </h3>
            </div>
            <div className="p-6 pt-0">
                <DayLogEntry
                    key={formatDate(selectedDate)}
                    date={selectedDate}
                    isToday={isToday}
                    value={getLog(selectedDate)}
                    onChange={(text) => updateLog(selectedDate, text)}
                />
            </div>
        </div>
    );
}

// Individual log entry row
interface DayLogEntryProps {
    date: Date;
    isToday: boolean;
    value: string;
    onChange: (text: string) => void;
}

function DayLogEntry({ date, isToday, value, onChange }: DayLogEntryProps) {
    const [localValue, setLocalValue] = useState(value);

    // Format date as "Mon 15"
    const displayDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
    });

    // Save on blur
    const handleBlur = () => {
        if (localValue !== value) {
            onChange(localValue);
        }
    };

    return (
        <div className="flex items-center gap-3">
            {/* Date label */}
            <div
                className={`w-16 text-sm font-medium ${isToday ? "text-purple-600" : "text-gray-400"
                    }`}
            >
                {displayDate}
            </div>

            {/* Text input */}
            <input
                type="text"
                placeholder="How was your day?"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                className={`flex-1 w-full rounded-lg border-0 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:ring-2 transition-colors focus:outline-none ${isToday ? "ring-1 ring-purple-200 focus:ring-purple-400" : ""
                    }`}
            />
        </div>
    );
}
