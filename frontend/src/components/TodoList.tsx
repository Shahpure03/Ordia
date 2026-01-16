/**
 * TodoList Component
 * Daily to-do list where users can add, complete, and delete tasks
 * Tasks are organized by day
 */

import { useState } from "react";
import type { OrdiaaStateHook } from "@/hooks/useOrdiaState";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";

interface TodoListProps {
    getTodos: OrdiaaStateHook["getTodos"];
    addTodo: OrdiaaStateHook["addTodo"];
    toggleTodo: OrdiaaStateHook["toggleTodo"];
    deleteTodo: OrdiaaStateHook["deleteTodo"];
    selectedDate: Date;
    onExpand: () => void;
}

export function TodoList({
    getTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    selectedDate,
    onExpand
}: TodoListProps) {
    const [newTodoText, setNewTodoText] = useState("");
    const todos = getTodos(selectedDate);

    const handleAddTodo = () => {
        if (newTodoText.trim()) {
            addTodo(selectedDate, newTodoText.trim());
            setNewTodoText("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddTodo();
        }
    };

    const completedCount = todos.filter((t) => t.completed).length;

    return (
        <div className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 pb-3">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 flex items-center gap-2">
                        <span>✅</span>
                        To-Do
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">
                            {completedCount}/{todos.length} done
                        </span>
                        <button
                            onClick={onExpand}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all"
                            title="Open detailed view"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
            <div className="p-4 sm:p-6 pt-0 space-y-3">
                {/* Add new todo input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-transparent"
                    />
                    <button
                        onClick={handleAddTodo}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                        Add
                    </button>
                </div>

                {/* Todo list */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {todos.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">
                            No tasks yet. Add one above! 📝
                        </p>
                    ) : (
                        todos.map((todo) => (
                            <div
                                key={todo.id}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                                    todo.completed
                                        ? "bg-green-50 text-green-700 ring-2 ring-green-400"
                                        : "bg-gray-50 hover:bg-gray-100"
                                )}
                            >
                                <label className="relative flex items-center justify-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(selectedDate, todo.id)}
                                        className={cn(
                                            "peer h-5 w-5 appearance-none rounded-md border-2 transition-all",
                                            todo.completed
                                                ? "border-green-500 bg-green-500"
                                                : "border-gray-300 hover:border-green-400 bg-white"
                                        )}
                                    />
                                    <svg
                                        className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
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
                                <span
                                    className={cn(
                                        "flex-1 text-sm",
                                        todo.completed && "line-through"
                                    )}
                                >
                                    {todo.text}
                                </span>
                                <button
                                    onClick={() => deleteTodo(selectedDate, todo.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Delete task"
                                >
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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
