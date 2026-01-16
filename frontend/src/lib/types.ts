/**
 * Type definitions for Ordiaa app
 * These define the shape of our data
 */

// A single habit/monthly goal that user wants to track
export interface Habit {
    id: string;
    name: string;
    emoji: string; // Visual icon for the habit
}

export type TodoStatus = "todo" | "in-progress" | "done";
export type TodoPriority = "low" | "medium" | "high";

// A single to-do item
export interface TodoItem {
    id: string;
    text: string;
    completed: boolean; // Kept for backward compat, but we'll use status primarily
    status: TodoStatus;
    priority: TodoPriority;
    createdAt: string; // Date string YYYY-MM-DD
}

// Track which habits are completed on which dates
// Key format: "habitId-YYYY-MM-DD"
export type HabitCompletions = Record<string, boolean>;

// Daily log entries, keyed by date "YYYY-MM-DD"
export type DailyLogs = Record<string, string>;

// Daily to-do items, keyed by date "YYYY-MM-DD"
export type DailyTodos = Record<string, TodoItem[]>;

// The complete app state
export interface OrdiaaState {
    habits: Habit[];
    completions: HabitCompletions;
    logs: DailyLogs;
    todos: DailyTodos;
}

// Demo quotes for the header
export const DAILY_QUOTES = [
    "Small steps lead to big changes.",
    "Progress, not perfection.",
    "Every day is a fresh start.",
    "Consistency is the key to mastery.",
    "Be gentle with yourself today.",
    "One habit at a time.",
    "You're doing better than you think.",
    "Trust the process.",
    "Growth happens slowly, then suddenly.",
    "Show up for yourself today.",
];

// Default monthly goals/habits
export const DEFAULT_HABITS: Habit[] = [
    { id: "1", name: "Morning stretch", emoji: "🧘" },
    { id: "2", name: "Read 10 pages", emoji: "📚" },
    { id: "3", name: "Drink water", emoji: "💧" },
    { id: "4", name: "Walk outside", emoji: "🚶" },
    { id: "5", name: "Journal", emoji: "✍️" },
];
