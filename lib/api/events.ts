import api from './api';

/* =======================
   EVENT INTERFACE
======================= */
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category?: string;
  status: string;
  isFeatured: boolean;
  files?: {
    url: string;
    resource_type: 'image' | 'video';
  }[];
  createdAt: string;
  updatedAt: string;
}

/* =======================
   API LAYER
======================= */
export const eventsApi = {
  // ✅ GET ALL EVENTS
  getAll: async (): Promise<Event[]> => {
    const res = await api.get('/events');
    return res.data.events; // 🔥 IMPORTANT
  },

  // ✅ GET SINGLE EVENT
  getById: async (id: string): Promise<Event> => {
    const res = await api.get(`/events/${id}`);
    return res.data.event;
  },

  // ✅ CREATE EVENT
  create: async (formData: FormData): Promise<Event> => {
    const res = await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.event;
  },

  // ✅ UPDATE EVENT
  update: async (id: string, data: Partial<Event>): Promise<Event> => {
    const res = await api.put(`/events/${id}`, data);
    return res.data.event;
  },

  // ✅ SOFT DELETE
  softDelete: async (id: string): Promise<void> => {
    await api.delete(`/events/soft/${id}`);
  },

  // ✅ RESTORE
  restore: async (id: string): Promise<Event> => {
    const res = await api.patch(`/events/restore/${id}`);
    return res.data.event;
  },

  // ✅ FEATURED EVENTS
  getFeatured: async (): Promise<Event[]> => {
    const res = await api.get('/events', {
      params: { featured: true },
    });
    return res.data.events;
  },

  // ✅ SEARCH
  search: async (query: string): Promise<Event[]> => {
    const res = await api.get('/events/search', {
      params: { q: query },
    });
    return res.data.events;
  },
};
