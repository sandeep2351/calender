import React, { useEffect, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  parseISO,
} from "date-fns";
import { cn } from "@/lib/utils";
import { AppEvent } from "@/services/api";

interface WeekViewProps {
  currentDate: Date;
  events: AppEvent[];
  onEventClick: (event: AppEvent) => void;
}

// Map categories to colors
const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  fit: { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800" },
  academics: { bg: "bg-green-100", border: "border-green-300", text: "text-green-800" },
  "ai-agent": { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800" },
  mle: { bg: "bg-red-100", border: "border-red-300", text: "text-red-800" },
  related: { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-800" },
  basics: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800" },
  other: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800" },
};

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onEventClick }) => {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [dayEvents, setDayEvents] = useState<Record<string, AppEvent[]>>({});
  
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours
  
  useEffect(() => {
    // Calculate the days of the week
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // Start from Sunday
    const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
    setWeekDays(days);
    
    // Organize events by day
    const eventsByDay: Record<string, AppEvent[]> = {};
    
    days.forEach((day) => {
      const dayKey = format(day, "yyyy-MM-dd");
      eventsByDay[dayKey] = events.filter((event) => {
        const eventStart = parseISO(event.start);
        return isSameDay(eventStart, day);
      });
    });
    
    setDayEvents(eventsByDay);
  }, [currentDate, events]);

  // Calculate event position and height based on time
  const getEventStyle = (event: AppEvent, hourHeight: number = 60) => {
    const startTime = parseISO(event.start);
    const endTime = parseISO(event.end);
    
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const endHour = endTime.getHours() + endTime.getMinutes() / 60;
    
    const top = startHour * hourHeight;
    const height = (endHour - startHour) * hourHeight;
    
    // If event is very short, ensure minimum height
    const minHeight = 20;
    
    return {
      top: `${top}px`,
      height: `${Math.max(height, minHeight)}px`,
    };
  };

  // Format event time display
  const formatEventTime = (event: AppEvent) => {
    const startTime = parseISO(event.start);
    return format(startTime, "h:mm a");
  };

  return (
    <div className="flex flex-col h-full border rounded-md shadow-sm">
      {/* Header row with day names and dates */}
      <div className="grid grid-cols-8 border-b bg-gray-50">
        <div className="p-2 border-r"></div>
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className={cn(
              "p-2 text-center border-r",
              isSameDay(day, new Date()) && "bg-blue-50"
            )}
          >
            <div className="text-sm text-gray-500">{format(day, "EEE")}</div>
            <div className="font-semibold">{format(day, "d")}</div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Time labels column */}
        <div className="flex-none w-16 bg-gray-50 border-r">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b relative text-xs text-gray-500 pr-2 text-right">
              <span className="absolute -top-2 right-2">
                {hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 flex-1">
          {weekDays.map((day, dayIdx) => (
            <div 
              key={dayIdx} 
              className={cn(
                "border-r relative", 
                isSameDay(day, new Date()) && "bg-blue-50"
              )}
            >
              {/* Hour grid lines - enhanced for better visibility */}
              {hours.map((hour) => (
                <div key={hour} className="h-[60px] border-b border-gray-200"></div>
              ))}
              
              {/* Events for this day */}
              {dayEvents[format(day, "yyyy-MM-dd")]?.map((event, eventIdx) => {
                const { bg, border, text } = categoryColors[event.category] || categoryColors.other;
                return (
                  <div
                    key={eventIdx}
                    onClick={() => onEventClick(event)}
                    className={cn(
                      "absolute left-0 right-0 mx-1 rounded p-1 border overflow-hidden cursor-pointer",
                      bg, border, text
                    )}
                    style={getEventStyle(event)}
                  >
                    <div className="text-xs font-medium">{formatEventTime(event)}</div>
                    <div className="text-xs truncate">{event.title}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
