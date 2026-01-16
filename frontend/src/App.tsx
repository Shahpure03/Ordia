/**
 * App Component - Ordia Dashboard
 * Main entry point that brings together all sections:
 * - Header with date and daily quote
 * - Daily To-Do list for today's tasks
 * - Monthly Goals tracker
 * - Daily log entries
 * - Progress visualization chart
 */

import { useState } from "react";
import { Header } from "./components/Header";
import { MonthlyGoals } from "@/components/HabitGrid";
import { DayLog } from "@/components/DayLog";
import { ProgressChart } from "@/components/ProgressChart";
import { TodoList } from "@/components/TodoList";
import { AdvancedTodoView } from "@/components/AdvancedTodoView";
import { CalendarWidget } from "@/components/CalendarWidget";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useOrdiaState } from "@/hooks/useOrdiaState";

function App() {
  // Initialize the shared app state from our custom hook
  const {
    habits,
    completions,
    toggleHabit,
    updateLog,
    getLog,
    getTodos,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    getCompletionHistory,
    addHabit,
    deleteHabit,
  } = useOrdiaState();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAdvancedTodoOpen, setIsAdvancedTodoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onFinished={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-teal-50">
      {/* Advanced Full Screen View */}
      {isAdvancedTodoOpen && (
        <AdvancedTodoView
          date={selectedDate}
          todos={getTodos(selectedDate)}
          addTodo={addTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          onBack={() => setIsAdvancedTodoOpen(false)}
          onDateChange={setSelectedDate}
        />
      )}

      {/* Main container - full width with responsive padding */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header banner with date and quote */}
        <Header />

        {/* Main content grid */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Left column: To-Do List and Daily Log */}
          <div className="space-y-6">
            <TodoList
              getTodos={getTodos}
              addTodo={addTodo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              selectedDate={selectedDate}

              onExpand={() => setIsAdvancedTodoOpen(true)}
            />
            {/* Day log also follows selected date but for now internal logic might need update.
                Actually DayLog component has multi-day logic inside. 
                We should probably update DayLog to focus on selected date or show log for selected date.
                The current DayLog shows "recent 5 days". The user requested: "selecting a date should... show the daily log for that date".
                Let's update DayLog logic to just show/edit log for selectedDate.
            */}
            <DayLog
              updateLog={updateLog}
              getLog={getLog}
              /* We'll modify DayLog component to accept selectedDate for focusing, or we can leave it as "recent list" but highlighted. 
                 User said: "show the daily log for that date". 
                 Actually, let's just pass the date and let DayLog decide.
                 Actually I need to modify DayLog to accept 'selectedDate'.
              */
              selectedDate={selectedDate}
            />

            <CalendarWidget selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </div>

          {/* Right column: Monthly Goals and Progress (takes 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <MonthlyGoals
              habits={habits}
              completions={completions}
              toggleHabit={toggleHabit}
              addHabit={addHabit}
              deleteHabit={deleteHabit}
            />
            <ProgressChart getCompletionHistory={getCompletionHistory} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>🌸 Ordia — calm habits, daily progress</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
