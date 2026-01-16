import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
    onFinished: () => void;
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onFinished, 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onFinished]);

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-xl transition-opacity duration-700",
                isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
        >
            {/* Concentric Pulse Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="pulse-ring ring-1" />
                <div className="pulse-ring ring-2" />
                <div className="pulse-ring ring-3" />
            </div>

            {/* Breathing Icon */}
            <div className="relative flex flex-col items-center justify-center">
                <div className="text-6xl sm:text-8xl animate-breathe">
                    🌸
                </div>
                <h1 className="mt-4 text-2xl font-bold text-gray-700 tracking-widest opacity-0 animate-fade-in-delayed">
                    ORDIAA
                </h1>
            </div>
        </div>
    );
}
