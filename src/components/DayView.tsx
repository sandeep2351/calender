
import React from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { AppEvent } from "@/services/api";

interface DayViewProps {
  currentDate: Date;
  events: AppEvent[];
  onEventClick: (event: AppEvent) => void;
}

// Map categories to colors (same as WeekView)
const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  fit: { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800" },
  academics: { bg: "bg-green-100", border: "border-green-300", text: "text-green-800" },
  "ai-agent": { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800" },
  mle: { bg: "bg-red-100", border: "border-red-300", text: "text-red-800" },
  related: { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-800" },
  basics: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800" },
  other: { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800" },
};

const DayView: React.FC<DayViewProps> = ({ currentDate, events, onEventClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours
  
  const todayEvents = events.filter((event) => {
    const eventStart = parseISO(event.start);
    return isSameDay(eventStart, currentDate);
  });

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
      <div className="grid grid-cols-2 border-b bg-gray-50">
        <div className="p-2 border-r"></div>
        <div className={cn("p-2 text-center border-r", isSameDay(currentDate, new Date()) && "bg-blue-50")}>
          <div className="text-sm text-gray-500">{format(currentDate, "EEEE")}</div>
          <div className="font-semibold">{format(currentDate, "d")}</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-y-auto">
        <div className="flex-none w-16 bg-gray-50 border-r">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b relative text-xs text-gray-500 pr-2 text-right">
              <span className="absolute -top-2 right-2">
                {hour === 0 ? "12 AM" : hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 border-r relative">
          {/* Hour lines - enhanced for better visibility */}
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b border-gray-200"></div>
          ))}
          
          {/* Events */}
          {todayEvents.map((event, eventIdx) => {
            const { bg, border, text } = categoryColors[event.category] || categoryColors.other;
            return (
              <div
                key={eventIdx}
                onClick={() => onEventClick(event)}
                className={cn(
                  "absolute left-0 right-0 mx-4 rounded p-2 border overflow-hidden cursor-pointer",
                  bg, border, text
                )}
                style={getEventStyle(event)}
              >
                <div className="text-xs font-medium">{formatEventTime(event)}</div>
                <div className="text-sm truncate">{event.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
