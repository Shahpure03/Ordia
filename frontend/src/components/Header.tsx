/**
 * Header Component
 * Displays current date, day of week, and a rotating daily quote
 * Creates a calm, welcoming banner at the top of the dashboard
 */

import { useMemo } from "react";
import { DAILY_QUOTES } from "@/lib/types";

export function Header() {
    const today = new Date();

    // Format the current date nicely
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Pick a quote based on the day of the year (rotates daily)
    const quote = useMemo(() => {
        const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
    }, []);

    return (
        <header className="w-full mb-8">
            <div className="bg-gradient-to-r from-rose-100 via-purple-100 to-teal-100 rounded-2xl p-8 shadow-sm">
                {/* Logo and App Name */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🌸</span>
                    <h1 className="text-2xl font-semibold text-gray-700 tracking-tight">
                        Ordiaa
                    </h1>
                </div>

                {/* Current Date */}
                <p className="text-lg text-gray-600 font-medium mb-3">
                    {formattedDate}
                </p>

                {/* Daily Quote */}
                <blockquote className="text-gray-500 italic border-l-2 border-purple-300 pl-4">
                    "{quote}"
                </blockquote>
            </div>
        </header>
    );
}
