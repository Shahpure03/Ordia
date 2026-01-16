
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CalendarWidgetProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export function CalendarWidget({ selectedDate, onDateChange }: CalendarWidgetProps) {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // Days needed for grid
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Days from previous month to fill the first row
    const prevMonthDays = Array.from({ length: firstDay }, (_, i) => {
        const d = new Date(year, month, 0);
        d.setDate(d.getDate() - (firstDay - 1 - i));
        return d;
    });

    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
        return new Date(year, month, i + 1);
    });

    // Remaining days to fill 6 rows (42 days grid)
    const totalSlots = 42;
    const filledSlots = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = Array.from({ length: totalSlots - filledSlots }, (_, i) => {
        return new Date(year, month + 1, i + 1);
    });

    const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const today = new Date();

    const handlePrevMonth = () => {
        setViewDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="border-0 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">
                    {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <div className="flex gap-1">
                    <button onClick={handlePrevMonth} className="!p-1 hover:!bg-gray-100 !bg-transparent !border-0 rounded-md !text-gray-500 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={handleNextMonth} className="!p-1 hover:!bg-gray-100 !bg-transparent !border-0 rounded-md !text-gray-500 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-400 font-medium">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {allDays.map((date, i) => {
                    const isCurrentMonth = date.getMonth() === month;
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, today);

                    return (
                        <button
                            key={i}
                            onClick={() => {
                                onDateChange(date);
                                if (!isCurrentMonth) {
                                    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
                                }
                            }}
                            className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center text-xs sm:text-sm transition-all relative",
                                // Force override global button styles
                                "!p-0 !border-0",
                                !isSelected && "!bg-transparent",
                                !isCurrentMonth && "!text-gray-300",
                                isCurrentMonth && !isSelected && "!text-gray-700 hover:!bg-blue-50 hover:!text-blue-600",
                                isToday && !isSelected && "!text-blue-600 font-bold !bg-blue-50 ring-1 ring-blue-100",
                                isSelected && "!bg-blue-600 !text-white shadow-md hover:!bg-blue-700"
                            )}
                        >
                            {date.getDate()}
                            {isToday && !isSelected && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
