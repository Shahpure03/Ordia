/**
 * MonthlyGoals Component
 * Monthly habit/goal tracker with blue checkboxes
 * Shows habits with their completion status for the current month
 */

import { useMemo, useState } from "react";

import { getMonthDates, formatDate } from "@/lib/storage";
import type { OrdiaaStateHook } from "@/hooks/useOrdiaState";
import { cn } from "@/lib/utils";

interface MonthlyGoalsProps {
    habits: OrdiaaStateHook["habits"];
    completions: OrdiaaStateHook["completions"];
    toggleHabit: OrdiaaStateHook["toggleHabit"];
    addHabit: OrdiaaStateHook["addHabit"];
    deleteHabit: OrdiaaStateHook["deleteHabit"];
}

export function MonthlyGoals({ habits, completions, toggleHabit, addHabit, deleteHabit }: MonthlyGoalsProps) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const [newGoalName, setNewGoalName] = useState("");

    // Get all dates for the current month
    const monthDates = useMemo(
        () => getMonthDates(currentYear, currentMonth),
        [currentYear, currentMonth]
    );

    // Month name for the header
    const monthName = today.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    // Calculate overall completion for the month (only for past/present days)
    const todayStr = formatDate(today);
    const validDates = monthDates.filter(d => formatDate(d) <= todayStr);

    const totalPossible = habits.length * validDates.length;

    // Count only completions that fall within valid dates for current habits
    const totalCompleted = habits.reduce((acc, habit) => {
        return acc + validDates.reduce((dateAcc, date) => {
            const key = `${habit.id}-${formatDate(date)}`;
            return dateAcc + (completions[key] ? 1 : 0);
        }, 0);
    }, 0);

    const overallPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    const handleAddGoal = () => {
        if (newGoalName.trim()) {
            // Use a standard emoji for all new goals
            addHabit(newGoalName.trim(), "✨");
            setNewGoalName("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddGoal();
        }
    };

    return (
        <div className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
            <div className="p-6 pb-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 flex items-center gap-2">
                        <span>✨</span>
                        Monthly Goals
                    </h3>
                    <span className="text-sm text-blue-600 font-medium">
                        {overallPercent}% this month
                    </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">{monthName}</p>
                </div>
            </div>
            <div className="p-6 pt-0">
                {/* Scrollable container for the grid */}
                <div className="overflow-x-auto mb-6">
                    <div className="min-w-max">
                        {/* Date headers */}
                        <div className="flex gap-2 mb-3 ml-36">
                            {monthDates.map((date) => {
                                const isToday = formatDate(date) === formatDate(today);
                                return (
                                    <div
                                        key={date.toISOString()}
                                        className={cn(
                                            "w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg",
                                            isToday
                                                ? "bg-blue-100 text-green-400 ring-2 ring-green-400"
                                                : "text-gray-400"
                                        )}
                                    >
                                        {date.getDate()}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Habit rows */}
                        {habits.map((habit) => (
                            <div key={habit.id} className="flex items-center gap-2 mb-2">
                                {/* Habit name and delete button */}
                                <div className="w-36 flex items-center gap-2 pr-2 group">
                                    <button
                                        onClick={() => deleteHabit(habit.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1 -ml-6 absolute"
                                        title="Delete goal"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                    </button>
                                    <span className="text-lg">{habit.emoji}</span>
                                    <span className="text-sm text-gray-600 truncate font-medium">
                                        {habit.name}
                                    </span>
                                </div>

                                {/* Completion cells - clearly blue */}
                                {monthDates.map((date) => {
                                    const dateStr = formatDate(date);
                                    const key = `${habit.id}-${dateStr}`;
                                    const isCompleted = completions[key] ?? false;
                                    const isToday = dateStr === formatDate(today);
                                    const isFuture = dateStr > formatDate(today);

                                    return (
                                        <div
                                            key={date.toISOString()}
                                            className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
                                                isFuture ? "opacity-30 pointer-events-none" : "",
                                                isToday && !isCompleted && "bg-green-50 ring-1 ring-green-200"
                                            )}
                                        >
                                            <label className="relative flex items-center justify-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isCompleted}
                                                    onChange={() => !isFuture && toggleHabit(habit.id, date)}
                                                    disabled={isFuture}
                                                    className={cn(
                                                        "peer h-6 w-6 appearance-none rounded-md border-2 transition-all disabled:cursor-not-allowed",
                                                        isCompleted
                                                            ? "border-green-500 bg-green-600"
                                                            : "border-green-200 hover:border-green-400 bg-white"
                                                    )}
                                                />
                                                <svg
                                                    className="pointer-events-none absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add new goal input */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <input
                        type="text"
                        placeholder="Add new monthly goal..."
                        value={newGoalName}
                        onChange={(e) => setNewGoalName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-transparent"
                    />
                    <button
                        onClick={handleAddGoal}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
                    >
                        Add Goal
                    </button>
                </div>
            </div>
        </div>
    );
}
