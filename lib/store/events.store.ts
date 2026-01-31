import { create } from 'zustand';
import { eventsApi, Event } from '@/lib/api/events';

interface EventsState {
  events: Event[];
  featuredEvents: Event[];
  event: Event | null;
  loading: boolean;
  error: string | null;

  fetchEvents: () => Promise<void>;
  fetchEvent: (id: string) => Promise<void>;
  fetchFeaturedEvents: () => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: [],
  featuredEvents: [],
  event: null,
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const events = await eventsApi.getAll();
      set({ events, loading: false });
    } catch {
      set({ error: 'Failed to load events', loading: false });
    }
  },

  fetchEvent: async (id) => {
    set({ loading: true });
    try {
      const event = await eventsApi.getById(id);
      set({ event, loading: false });
    } catch {
      set({ error: 'Failed to load event', loading: false });
    }
  },

  fetchFeaturedEvents: async () => {
    set({ loading: true });
    try {
      const featuredEvents = await eventsApi.getFeatured();
      set({ featuredEvents, loading: false });
    } catch {
      set({ error: 'Failed to load featured events', loading: false });
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true });
    await eventsApi.softDelete(id);
    set((state) => ({
      events: state.events.filter(e => e._id !== id),
      loading: false,
    }));
  },
}));
