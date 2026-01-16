/**
 * Custom React hook for managing Ordiaa app state
 * This is the single source of truth for all app data
 * State persists to localStorage automatically
 */

import { useState, useEffect, useCallback } from "react";
import type { OrdiaaState, Habit, TodoItem, TodoPriority, TodoStatus } from "@/lib/types";
import { loadState, saveState, formatDate } from "@/lib/storage";

export function useOrdiaaState() {
    // Initialize state from localStorage
    const [state, setState] = useState<OrdiaaState>(loadState);

    // Save to localStorage whenever state changes
    useEffect(() => {
        saveState(state);
    }, [state]);

    // Toggle a habit's completion for a specific date
    const toggleHabit = useCallback((habitId: string, date: Date) => {
        const dateStr = formatDate(date);
        const key = `${habitId}-${dateStr}`;

        setState((prev) => ({
            ...prev,
            completions: {
                ...prev.completions,
                [key]: !prev.completions[key],
            },
        }));
    }, []);

    // Update daily log entry
    const updateLog = useCallback((date: Date, text: string) => {
        const dateStr = formatDate(date);
        setState((prev) => ({
            ...prev,
            logs: {
                ...prev.logs,
                [dateStr]: text,
            },
        }));
    }, []);

    // Get log entry for a specific date
    const getLog = useCallback(
        (date: Date): string => {
            return state.logs[formatDate(date)] || "";
        },
        [state.logs]
    );

    // ============ TODO FUNCTIONS ============

    // Get todos for a specific date
    const getTodos = useCallback(
        (date: Date): TodoItem[] => {
            return state.todos[formatDate(date)] || [];
        },
        [state.todos]
    );

    // Add a new todo for a specific date
    const addTodo = useCallback((date: Date, text: string, priority: TodoPriority = "medium", status: TodoStatus = "todo") => {
        const dateStr = formatDate(date);
        const newTodo: TodoItem = {
            id: Date.now().toString(),
            text,
            completed: status === "done",
            status,
            priority,
            createdAt: dateStr,
        };

        setState((prev) => ({
            ...prev,
            todos: {
                ...prev.todos,
                [dateStr]: [...(prev.todos[dateStr] || []), newTodo],
            },
        }));
    }, []);

    // Toggle todo completion (simple view)
    const toggleTodo = useCallback((date: Date, todoId: string) => {
        const dateStr = formatDate(date);

        setState((prev) => ({
            ...prev,
            todos: {
                ...prev.todos,
                [dateStr]: (prev.todos[dateStr] || []).map((todo) => {
                    if (todo.id === todoId) {
                        const newCompleted = !todo.completed;
                        return {
                            ...todo,
                            completed: newCompleted,
                            status: newCompleted ? "done" : "todo", // revert to todo if unchecking
                        };
                    }
                    return todo;
                }),
            },
        }));
    }, []);

    // Fully update a todo (for detailed view)
    const updateTodo = useCallback((date: Date, todoId: string, updates: Partial<TodoItem>) => {
        const dateStr = formatDate(date);

        setState((prev) => ({
            ...prev,
            todos: {
                ...prev.todos,
                [dateStr]: (prev.todos[dateStr] || []).map((todo) =>
                    todo.id === todoId ? { ...todo, ...updates } : todo
                ),
            },
        }));
    }, []);

    // Delete a todo
    const deleteTodo = useCallback((date: Date, todoId: string) => {
        const dateStr = formatDate(date);

        setState((prev) => ({
            ...prev,
            todos: {
                ...prev.todos,
                [dateStr]: (prev.todos[dateStr] || []).filter(
                    (todo) => todo.id !== todoId
                ),
            },
        }));
    }, []);

    // ============ HABIT/GOAL FUNCTIONS ============

    // Calculate completion percentage for a specific date
    const getCompletionRate = useCallback(
        (date: Date): number => {
            const dateStr = formatDate(date);
            const total = state.habits.length;
            if (total === 0) return 0;

            const completed = state.habits.filter(
                (h) => state.completions[`${h.id}-${dateStr}`]
            ).length;

            return Math.round((completed / total) * 100);
        },
        [state.habits, state.completions]
    );

    // Get completion rates for the last N days (for the chart)
    const getCompletionHistory = useCallback(
        (days: number): { date: string; rate: number }[] => {
            const history: { date: string; rate: number }[] = [];
            const today = new Date();

            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                history.push({
                    date: date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    }),
                    rate: getCompletionRate(date),
                });
            }

            return history;
        },
        [getCompletionRate]
    );

    // Add a new habit
    const addHabit = useCallback((name: string, emoji: string) => {
        const newHabit: Habit = {
            id: Date.now().toString(),
            name,
            emoji,
        };
        setState((prev) => ({
            ...prev,
            habits: [...prev.habits, newHabit],
        }));
    }, []);

    // Delete a habit
    const deleteHabit = useCallback((habitId: string) => {
        setState((prev) => ({
            ...prev,
            habits: prev.habits.filter((h) => h.id !== habitId),
        }));
    }, []);

    return {
        habits: state.habits,
        completions: state.completions,
        logs: state.logs,
        todos: state.todos,
        toggleHabit,
        isHabitCompleted: (habitId: string, date: Date) => {
            const key = `${habitId}-${formatDate(date)}`;
            return state.completions[key] ?? false;
        },
        updateLog,
        getLog,
        getTodos,
        addTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
        getCompletionRate,
        getCompletionHistory,
        addHabit,
        deleteHabit,
    };
}

// Export the return type so components can use it
export type OrdiaaStateHook = ReturnType<typeof useOrdiaaState>;
