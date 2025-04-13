import axios from 'axios';

// Define our app event type
export interface AppEvent {
  _id: string;
  title: string;
  start: string;
  end: string;
  category: string;
  description?: string;
}

// Base URL for API requests
const API_URL =
  import.meta.env.VITE_API_URL || 'https://calender-9en1.onrender.com/api';

// API client setup
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchEvents = async (): Promise<AppEvent[]> => {
  try {
    const { data } = await apiClient.get('/events');
    return data.map((event: any) => ({
      _id: event._id,
      title: event.title,
      start: event.start,
      end: event.end,
      category: event.category,
      description: event.description || '',
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (
  eventData: Omit<AppEvent, '_id'>
): Promise<AppEvent> => {
  try {
    const { data } = await apiClient.post('/events', eventData);
    return {
      _id: data._id,
      title: data.title,
      start: data.start,
      end: data.end,
      category: data.category,
      description: data.description || '',
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (
  id: string,
  eventData: Partial<AppEvent>
): Promise<AppEvent> => {
  try {
    const { data } = await apiClient.put(`/events/${id}`, eventData);
    return {
      _id: data._id,
      title: data.title,
      start: data.start,
      end: data.end,
      category: data.category,
      description: data.description || '',
    };
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const { data } = await apiClient.delete(`/events/${id}`);
    return { message: data.message };
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw error;
  }
};

export default {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
