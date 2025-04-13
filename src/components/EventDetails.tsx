import React from "react";
import { format, parseISO } from "date-fns";
import {
  Clock,
  Calendar as CalendarIcon,
  Tag,
  AlignLeft,
  X,
} from "lucide-react";
import { AppEvent } from "@/services/api";

interface EventDetailsProps {
  event: AppEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
}) => {
  const startTime = parseISO(event.start);
  const endTime = parseISO(event.end);

  const categoryLabels: Record<string, string> = {
    fit: "Be Fit",
    academics: "Academics",
    "ai-agent": "AI based agents",
    mle: "MLE",
    related: "DE-related",
    basics: "Basics",
    other: "Other",
  };

  const categoryColors: Record<string, string> = {
    fit: "#4f46e5",
    academics: "#10b981",
    "ai-agent": "#f59e0b",
    mle: "#ef4444",
    related: "#8b5cf6",
    basics: "#6b7280",
    other: "#6b7280",
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">{event.title}</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-gray-700">
          <CalendarIcon size={18} className="mr-2" />
          <span>{format(startTime, "EEEE, MMMM d, yyyy")}</span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <Clock size={18} className="mr-2" />
          <span>
            {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
          </span>
        </div>
        
        <div className="flex items-center text-gray-700">
          <Tag size={18} className="mr-2" />
          <div 
            className="flex items-center"
            style={{ color: categoryColors[event.category] }}
          >
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: categoryColors[event.category] }}
            ></span>
            <span>{categoryLabels[event.category] || "Other"}</span>
          </div>
        </div>
        
        {event.description && (
          <div className="flex items-start text-gray-700">
            <AlignLeft size={18} className="mr-2 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium mb-1">Description</h4>
              <p>{event.description}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end mt-6 space-x-2">
        <button
          onClick={onDelete}
          className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
        >
          Delete
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
