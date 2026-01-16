/**
 * AdvancedTodoView Component - Ordiaa
 * Detailed Kanban-style board for managing daily tasks
 * Grouped by status: Todo, In Progress, Done
 */

import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TodoItem, TodoPriority, TodoStatus } from "@/lib/types";
import { DateNavigator } from "./DateNavigator";

interface AdvancedTodoViewProps {
    date: Date;
    todos: TodoItem[];
    addTodo: (date: Date, text: string, priority: TodoPriority, status: TodoStatus) => void;
    updateTodo: (date: Date, todoId: string, updates: Partial<TodoItem>) => void;
    deleteTodo: (date: Date, todoId: string) => void;
    onBack: () => void;
    onDateChange: (date: Date) => void;
}


const STATUSES: TodoStatus[] = ["todo", "in-progress", "done"];

export function AdvancedTodoView({
    date,
    todos,
    addTodo,
    updateTodo,
    deleteTodo,

    onBack,
    onDateChange,
}: AdvancedTodoViewProps) {
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<TodoPriority>("medium");
    const [newTaskStatus, setNewTaskStatus] = useState<TodoStatus>("todo");
    // Local state for date navigation strictly within this view if needed, 
    // but we use the passed 'date' prop to keep it synced with parent.

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            addTodo(date, newTaskText.trim(), newTaskPriority, newTaskStatus);
            setNewTaskText("");
            // Reset to defaults
            setNewTaskPriority("medium");
            setNewTaskStatus("todo");
        }
    };

    // Helper to get color for priority badge
    const getPriorityColor = (priority: TodoPriority) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-700 border-red-200";
            case "medium":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "low":
                return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    const StatusColumn = ({ status, items }: { status: TodoStatus; items: TodoItem[] }) => (
        <div className="flex-1 min-w-[300px] flex flex-col gap-3">
            <h3 className="font-semibold text-gray-700 capitalize flex items-center justify-between sticky top-0 bg-white/50 backdrop-blur-sm p-2 rounded-lg z-10">
                {status.replace("-", " ")}
                <span className="text-sm font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full border">
                    {items.length}
                </span>
            </h3>
            <div className="space-y-3">
                {items.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                        No tasks
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
                        >
                            {/* Header: Priority & Delete */}
                            <div className="flex justify-between items-start mb-2">
                                <span
                                    className={cn(
                                        "text-xs px-2 py-1 rounded-full border font-medium uppercase tracking-wider",
                                        getPriorityColor(item.priority || "medium")
                                    )}
                                >
                                    {item.priority || "medium"}
                                </span>
                                <button
                                    onClick={() => deleteTodo(date, item.id)}
                                    className="text-white hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <span className="sr-only">Delete</span>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Task Content */}
                            <p className="text-gray-800 font-medium mb-3">{item.text}</p>

                            {/* Footer: Status Move Actions */}
                            <div className="flex gap-1 text-xs text-gray-500 pt-2 border-t border-gray-50">
                                <label className="flex items-center gap-1">
                                    Status:
                                    <select
                                        value={item.status || "todo"}
                                        onChange={(e) => {
                                            const newStatus = e.target.value as TodoStatus;
                                            updateTodo(date, item.id, {
                                                status: newStatus,
                                                completed: newStatus === "done",
                                            });
                                        }}
                                        className="bg-gray-50 border-0 rounded p-1 hover:bg-gray-100 cursor-pointer focus:ring-0 text-gray-700 font-medium"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </label>
                                <span className="text-gray-300 mx-1">|</span>
                                <label className="flex items-center gap-1">
                                    Priority:
                                    <select
                                        value={item.priority || "medium"}
                                        onChange={(e) =>
                                            updateTodo(date, item.id, {
                                                priority: e.target.value as TodoPriority,
                                            })
                                        }
                                        className="bg-gray-50 border-0 rounded p-1 hover:bg-gray-100 cursor-pointer focus:ring-0 text-gray-700"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-50/95 backdrop-blur-xl z-50 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white bg-white/50 rounded-lg transition-all text-gray-600 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
                            <p className="text-gray-500 text-sm">Manage your daily tasks</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <DateNavigator selectedDate={date} onDateChange={onDateChange} />
                </div>

                {/* Add New Task Bar */}
                <form
                    onSubmit={handleAddTask}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex gap-4 items-center flex-wrap"
                >
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        className="flex-1 min-w-[200px] border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none border"
                    />
                    <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as TodoPriority)}
                        className="border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none border"
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <select
                        value={newTaskStatus}
                        onChange={(e) => setNewTaskStatus(e.target.value as TodoStatus)}
                        className="border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-sm focus:ring-2 focus:ring-purple-500 outline-none border"
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </button>
                </form>

                {/* Kanban Columns */}
                <div className="flex-1 overflow-x-auto">
                    <div className="flex gap-6 min-w-full pb-4 items-start">
                        {STATUSES.map((status) => (
                            <StatusColumn
                                key={status}
                                status={status}
                                items={todos.filter(
                                    (t) => (t.status || (t.completed ? "done" : "todo")) === status
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
