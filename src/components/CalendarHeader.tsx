
import React from "react";
import { Button } from "@/components/ui/button";
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "day" | "week" | "month";
  onDateChange: (date: Date) => void;
  onViewChange: (view: "day" | "week" | "month") => void;
  onAddEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onDateChange,
  onViewChange,
  onAddEvent,
}) => {
  // Navigation functions
  const handlePrevious = () => {
    switch (view) {
      case "day":
        onDateChange(subDays(currentDate, 1));
        break;
      case "week":
        onDateChange(subDays(currentDate, 7));
        break;
      case "month":
        // Go to first day of previous month
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        onDateChange(prevMonth);
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case "day":
        onDateChange(addDays(currentDate, 1));
        break;
      case "week":
        onDateChange(addDays(currentDate, 7));
        break;
      case "month":
        // Go to first day of next month
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        onDateChange(nextMonth);
        break;
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  // Format the header title based on view
  const formatTitle = () => {
    switch (view) {
      case "day":
        return format(currentDate, "MMMM d, yyyy");
      case "week": {
        const start = startOfWeek(currentDate, { weekStartsOn: 0 });
        const end = endOfWeek(currentDate, { weekStartsOn: 0 });
        const sameMonth = start.getMonth() === end.getMonth();
        return sameMonth
          ? `${format(start, "MMMM d")} - ${format(end, "d, yyyy")}`
          : `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
      }
      case "month":
        return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={handleToday}>
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">{formatTitle()}</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="border rounded-md overflow-hidden flex">
          <Button
            variant={view === "day" ? "default" : "ghost"}
            onClick={() => onViewChange("day")}
            className="rounded-none"
          >
            Day
          </Button>
          <Button
            variant={view === "week" ? "default" : "ghost"}
            onClick={() => onViewChange("week")}
            className="rounded-none"
          >
            Week
          </Button>
          <Button
            variant={view === "month" ? "default" : "ghost"}
            onClick={() => onViewChange("month")}
            className="rounded-none"
          >
            Month
          </Button>
        </div>
        <Button onClick={onAddEvent} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" /> Add Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
