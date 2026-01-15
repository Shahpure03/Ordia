import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/storage";

interface DateNavigatorProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        onDateChange(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        onDateChange(newDate);
    };

    const isToday = formatDate(selectedDate) === formatDate(new Date());

    return (
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-2 mb-4 w-fit">
            <button
                onClick={handlePrevDay}
                className="p-1 hover:bg-white rounded-md transition-colors text-gray-500 hover:text-gray-700"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                {selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                })}
                {isToday && <span className="ml-2 text-xs text-blue-500 font-bold">(Today)</span>}
            </span>

            <button
                onClick={handleNextDay}
                className="p-1 hover:bg-white rounded-md transition-colors text-gray-500 hover:text-gray-700"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
