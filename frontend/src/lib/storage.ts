/**
 * localStorage utilities for persisting Ordiaa state
 * Data persists across browser refreshes
 */

import type { OrdiaaState, HabitCompletions, DailyLogs, DailyTodos } from "./types";
import { DEFAULT_HABITS } from "./types";

const STORAGE_KEY = "ordiaa-data";

// Load state from localStorage, or return defaults if nothing saved
export function loadState(): OrdiaaState {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved) as OrdiaaState;
            // Ensure todos exists (for migration from old data)
            if (!parsed.todos) {
                parsed.todos = generateDemoTodos();
            }
            return parsed;
        }
    } catch (error) {
        console.error("Failed to load state from localStorage:", error);
    }

    // Return default state with demo data
    return {
        habits: DEFAULT_HABITS,
        completions: generateDemoCompletions(),
        logs: generateDemoLogs(),
        todos: generateDemoTodos(),
    };
}

// Save state to localStorage
export function saveState(state: OrdiaaState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save state to localStorage:", error);
    }
}

// Generate some demo completion data for the past 2 weeks
function generateDemoCompletions(): HabitCompletions {
    const completions: HabitCompletions = {};
    const today = new Date();

    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);

        // Randomly complete some habits for demo purposes
        DEFAULT_HABITS.forEach((habit) => {
            if (Math.random() > 0.4) {
                completions[`${habit.id}-${dateStr}`] = true;
            }
        });
    }

    return completions;
}

// Generate some demo log entries
function generateDemoLogs(): DailyLogs {
    const logs: DailyLogs = {};
    const today = new Date();
    const demoEntries = [
        "Felt energetic today! ✨",
        "Tough morning but pushed through",
        "Made progress on the book",
        "Quiet day, needed rest",
        "Great walk in the park",
    ];

    for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i * 2);
        logs[formatDate(date)] = demoEntries[i];
    }

    return logs;
}

// Generate demo to-do items
function generateDemoTodos(): DailyTodos {
    const todos: DailyTodos = {};
    const today = new Date();
    const dateStr = formatDate(today);

    // Add some demo todos for today
    todos[dateStr] = [
        { id: "demo1", text: "Review project requirements", completed: true, status: "done", priority: "high", createdAt: dateStr },
        { id: "demo2", text: "Send email to team", completed: false, status: "todo", priority: "medium", createdAt: dateStr },
        { id: "demo3", text: "Prepare for meeting", completed: false, status: "todo", priority: "medium", createdAt: dateStr },
    ];

    return todos;
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get array of dates for the current month
export function getMonthDates(year: number, month: number): Date[] {
    const dates: Date[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }

    return dates;
}
