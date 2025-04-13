
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEvents, createEvent, updateEvent, deleteEvent, AppEvent } from "@/services/api";
import CalendarHeader from "@/components/CalendarHeader";
import Sidebar from "@/components/Sidebar";
import WeekView from "@/components/WeekView";
import DayView from "@/components/DayView";
import MonthView from "@/components/MonthView";
import EventModal from "@/components/EventModal";
import EventDetails from "@/components/EventDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const categories = [
  { id: "fit", name: "Be Fit", color: "#4f46e5" },
  { id: "academics", name: "Academics", color: "#10b981" },
  { id: "ai-agent", name: "AI based agents", color: "#f59e0b" },
  { id: "mle", name: "MLE", color: "#ef4444" },
  { id: "related", name: "DE-related", color: "#8b5cf6" },
  { id: "basics", name: "Basics", color: "#6b7280" },
];

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  
  // Fetch events with react-query
  const { data: events = [], isLoading, isError, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
  
  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event created",
        description: "Your event has been successfully created.",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
      console.error("Create event error:", error);
    }
  });
  
  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event updated",
        description: "Your event has been successfully updated.",
      });
      setIsModalOpen(false);
      setEditingEvent(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
      console.error("Update event error:", error);
    }
  });
  
  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event deleted",
        description: "Your event has been successfully deleted.",
      });
      closeEventDetails();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
      console.error("Delete event error:", error);
    }
  });
  
  // Filter events by selected category
  const filteredEvents = selectedCategory
    ? events.filter((event: AppEvent) => event.category === selectedCategory)
    : events;
  
  // Handle adding a new event
  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };
  
  // Handle event click
  const handleEventClick = (event: AppEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };
  
  // Handle day click in month view
  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setView("day");
  };
  
  // Save event (create or update)
  const handleSaveEvent = (eventData: any) => {
    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent._id, data: eventData });
    } else {
      createEventMutation.mutate(eventData);
    }
  };
  
  // Edit an existing event
  const handleEditEvent = () => {
    setEditingEvent(selectedEvent);
    setIsDetailsOpen(false);
    setIsModalOpen(true);
  };
  
  // Delete an event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent._id);
    }
  };
  
  // Close event details
  const closeEventDetails = () => {
    setIsDetailsOpen(false);
    setSelectedEvent(null);
  };
  
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="flex-none">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          events={events}
          onEventClick={handleEventClick}
        />
      </div>
      
      {/* Main calendar area */}
      <div className="flex-1 flex flex-col">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onDateChange={setCurrentDate}
          onViewChange={setView}
          onAddEvent={handleAddEvent}
        />
        
        {isLoading ? (
          <div className="flex-1 p-8">
            <Skeleton className="w-full h-32 mb-4" />
            <Skeleton className="w-full h-32 mb-4" />
            <Skeleton className="w-full h-32" />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-red-500 mb-2">Error loading events</h3>
              <p className="text-gray-600">
                {error instanceof Error ? error.message : "Please try again later."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden p-4">
            {view === "week" && (
              <WeekView
                currentDate={currentDate}
                events={filteredEvents}
                onEventClick={handleEventClick}
              />
            )}
            {view === "day" && (
              <DayView
                currentDate={currentDate}
                events={filteredEvents}
                onEventClick={handleEventClick}
              />
            )}
            {view === "month" && (
              <MonthView
                currentDate={currentDate}
                events={filteredEvents}
                onEventClick={handleEventClick}
                onDayClick={handleDayClick}
              />
            )}
          </div>
        )}
      </div>
      
      {/* Event modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        editEvent={editingEvent}
      />
      
      {/* Event details sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          {selectedEvent && (
            <EventDetails
              event={selectedEvent}
              onClose={closeEventDetails}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
