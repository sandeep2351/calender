import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { cn } from "@/lib/utils";
import { AppEvent } from "@/services/api";

interface MonthViewProps {
  currentDate: Date;
  events: AppEvent[];
  onEventClick: (event: AppEvent) => void;
  onDayClick: (date: Date) => void;
}

// Map categories to colors (same as other views)
const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  fit: { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800" },
  academics: { bg: "bg-green-100", border: "border-green-300", text: "text-green-800" },
  "ai-agent": { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800" },
  mle: { bg: "bg-red-100", border: "border-red-300", text: "text-red-800" },
  related: { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-800" },
  basics: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800" },
  other: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800" },
};

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onDayClick,
}) => {
  // Get all days to display in the monthly view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Group days into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  allDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventStart = parseISO(event.start);
      return isSameDay(eventStart, day);
    });
  };

  return (
    <div className="flex flex-col h-full border rounded-md shadow-md">
      {/* Header row with day names */}
      <div className="grid grid-cols-7 border-b text-center text-gray-500 bg-gray-50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
          <div key={weekday} className="p-2 border-r border-gray-200">
            {weekday}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 h-full">
          {weeks.flat().map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={idx}
                onClick={() => onDayClick(day)}
                className={cn(
                  "border-r border-b p-1 h-32 overflow-hidden border-gray-200",
                  !isCurrentMonth && "bg-gray-50 text-gray-400",
                  isToday && "bg-blue-50",
                  "hover:bg-gray-100 cursor-pointer"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={cn("text-sm font-medium", isToday && "text-blue-600")}>
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, eventIdx) => {
                    const { bg, text } = categoryColors[event.category] || categoryColors.other;
                    return (
                      <div
                        key={eventIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={cn(
                          "text-xs p-1 rounded truncate",
                          bg, text
                        )}
                      >
                        <span className="font-medium">
                          {format(parseISO(event.start), "h:mm a")}
                        </span>{" "}
                        {event.title}
                      </div>
                    );
                  })}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      + {dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
