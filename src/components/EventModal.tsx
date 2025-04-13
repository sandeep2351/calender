import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppEvent } from "@/services/api";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: any) => void;
  editEvent?: AppEvent | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, editEvent }) => {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = React.useState("08:00");
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());
  const [endTime, setEndTime] = React.useState("09:00");

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setCategory(editEvent.category);
      setDescription(editEvent.description || "");
      
      const start = parseISO(editEvent.start);
      const end = parseISO(editEvent.end);
      
      setStartDate(start);
      setStartTime(format(start, "HH:mm"));
      setEndDate(end);
      setEndTime(format(end, "HH:mm"));
    } else {
      resetForm();
    }
  }, [editEvent, isOpen]);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setStartDate(new Date());
    setStartTime("08:00");
    setEndDate(new Date());
    setEndTime("09:00");
  };

  const handleSave = () => {
    if (!startDate || !endDate || !title || !category) {
      return;
    }
    
    const startDateTime = new Date(startDate);
    startDateTime.setHours(
      parseInt(startTime.split(":")[0]),
      parseInt(startTime.split(":")[1]),
      0
    );
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(
      parseInt(endTime.split(":")[0]),
      parseInt(endTime.split(":")[1]),
      0
    );

    const eventData: any = {
      title,
      category,
      description,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
    };
    
    if (editEvent?._id) {
      eventData._id = editEvent._id;
    }

    onSave(eventData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span className="text-xl font-semibold">
              {editEvent ? "Edit Event" : "Create New Event"}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="flex items-center text-sm font-medium">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              Title
            </label>
            <Input
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <label className="flex items-center text-sm font-medium">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fit">Be Fit</SelectItem>
                <SelectItem value="academics">Academics</SelectItem>
                <SelectItem value="ai-agent">AI based agents</SelectItem>
                <SelectItem value="mle">MLE</SelectItem>
                <SelectItem value="related">DE-related</SelectItem>
                <SelectItem value="basics">Basics</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <label className="flex items-center text-sm font-medium">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              Description
            </label>
            <Textarea 
              placeholder="Event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <label className="flex items-center text-sm font-medium">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              Start Time
            </label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal w-[180px]",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate ? (
                      format(startDate, "MM/dd/yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-[120px]"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label className="flex items-center text-sm font-medium">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              End Time
            </label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal w-[180px]",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    {endDate ? (
                      format(endDate, "MM/dd/yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-[120px]"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {editEvent ? "Update Event" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
