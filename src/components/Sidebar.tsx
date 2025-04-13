import React from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon, CircleIcon } from "lucide-react";
import { AppEvent } from "@/services/api";

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  events: AppEvent[];
  onEventClick: (event: AppEvent) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  events,
  onEventClick,
}) => {
  const sections = [
    { title: "GOALS", categories: categories.filter(c => ["fit", "academics"].includes(c.id)) },
    { title: "TASKS", categories: categories.filter(c => ["ai-agent", "mle", "related", "basics"].includes(c.id)) },
  ];

  // Group events by category
  const eventsByCategory: Record<string, AppEvent[]> = {};
  categories.forEach((category) => {
    eventsByCategory[category.id] = events.filter(
      (event) => event.category === category.id
    );
  });

  return (
    <div className="w-52 bg-white border-r border-gray-200 h-full overflow-y-auto flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Calendar</h2>
      </div>
      
      <div className="flex-1">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => onSelectCategory(category.id === selectedCategory ? null : category.id)}
                    className={cn(
                      "w-full flex items-center px-4 py-2 text-sm rounded-sm hover:bg-gray-100",
                      selectedCategory === category.id && "bg-blue-50 text-blue-600 font-medium"
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: category.color || "#6B7280" }}
                    ></span>
                    {category.name}
                  </button>
                  
                  {/* Event list under each category */}
                  {eventsByCategory[category.id]?.length > 0 && (
                    <div className="ml-8 mt-1 space-y-1">
                      {eventsByCategory[category.id].map((event) => (
                        <button
                          key={event._id}
                          onClick={() => onEventClick(event)}
                          className="text-xs w-full text-left py-1 px-2 hover:bg-gray-50 rounded flex items-center"
                        >
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span className="truncate">{event.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Recent events section */}
      <div className="border-t border-gray-200 pt-4 pb-4 px-4">
        <h3 className="text-xs font-semibold text-gray-500 mb-2">RECENT EVENTS</h3>
        <div className="space-y-2">
          {events.slice(0, 5).map((event) => (
            <button
              key={event._id}
              onClick={() => onEventClick(event)}
              className="text-xs w-full text-left py-1 px-2 hover:bg-gray-50 rounded-sm flex items-center"
            >
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: categories.find(c => c.id === event.category)?.color || "#6B7280" }}
              ></span>
              <span className="truncate">{event.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
