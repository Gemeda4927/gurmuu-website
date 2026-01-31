import { create } from "zustand";
import { persist } from "zustand/middleware";
import { eventApi } from "@/lib/api/eventApi";
import {
  EventData,
  PaginatedResponse,
} from "../types/event";

interface EventStoreState {
  // State
  events: EventData[];
  currentEvent: EventData | null;
  deletedEvents: EventData[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    totalPages: number;
    currentPage: number;
  };

  // Actions
  fetchEvents: (params?: any) => Promise<void>;
  fetchEvent: (id: string) => Promise<void>;
  fetchDeletedEvents: () => Promise<void>;
  createEvent: (data: any) => Promise<EventData>;
  updateEvent: (
    id: string,
    data: any
  ) => Promise<void>;
  softDeleteEvent: (id: string) => Promise<void>;
  restoreEvent: (id: string) => Promise<void>;
  hardDeleteEvent: (id: string) => Promise<void>;
  uploadImages: (
    id: string,
    files: File[]
  ) => Promise<void>;
  removeImage: (
    eventId: string,
    imageId: string
  ) => Promise<void>;
  clearError: () => void;
  clearCurrentEvent: () => void;
}

export const useEventStore =
  create<EventStoreState>()(
    persist(
      (set, get) => ({
        // Initial state
        events: [],
        currentEvent: null,
        deletedEvents: [],
        loading: false,
        error: null,
        pagination: {
          count: 0,
          totalPages: 1,
          currentPage: 1,
        },

        // In your events.store.ts
        fetchEvents: async (params = {}) => {
          set({ loading: true, error: null });
          try {
            // Get active events by default
            const response =
              await eventApi.getEvents({
                ...params,
                deleted: false, // Ensure we only get active events
              });
            set({
              events: response.events || [],
              pagination: {
                count: response.count || 0,
                totalPages:
                  response.totalPages || 1,
                currentPage:
                  response.currentPage || 1,
              },
            });
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to fetch events";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        fetchEvent: async (id: string) => {
          set({ loading: true, error: null });
          try {
            const response =
              await eventApi.getEventById(id);
            if (
              response.success &&
              response.event
            ) {
              set({
                currentEvent: response.event,
              });
            } else {
              throw new Error(
                response.message ||
                  "Event not found"
              );
            }
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to fetch event";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        fetchDeletedEvents: async () => {
          set({ loading: true, error: null });
          try {
            const response =
              await eventApi.getDeletedEvents();
            set({
              deletedEvents:
                response.events || [],
            });
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to fetch deleted events";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        createEvent: async (data: any) => {
          set({ loading: true, error: null });
          try {
            const response =
              await eventApi.createEvent(data);
            if (
              response.success &&
              response.event
            ) {
              const currentEvents = get().events;
              set({
                events: [
                  response.event,
                  ...currentEvents,
                ],
                currentEvent: response.event,
              });
              return response.event;
            }
            throw new Error(
              response.message ||
                "Failed to create event"
            );
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to create event";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        updateEvent: async (
          id: string,
          data: any
        ) => {
          set({ loading: true, error: null });
          try {
            const response =
              await eventApi.updateEvent(
                id,
                data
              );
            if (
              response.success &&
              response.event
            ) {
              const currentEvents = get().events;
              const updatedEvents =
                currentEvents.map((event) =>
                  event._id === id
                    ? response.event!
                    : event
                );

              set({
                events: updatedEvents,
                currentEvent: response.event,
              });
            } else {
              throw new Error(
                response.message ||
                  "Failed to update event"
              );
            }
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to update event";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        softDeleteEvent: async (id: string) => {
          set({ loading: true, error: null });
          try {
            const response =
              await eventApi.softDeleteEvent(id);
            if (response.success) {
              const currentEvent =
                get().currentEvent;
              const currentEvents = get().events;
              const deletedEvents =
                get().deletedEvents;

              const eventToDelete =
                currentEvents.find(
                  (event) => event._id === id
                );

              set({
                events: currentEvents.filter(
                  (event) => event._id !== id
                ),
                deletedEvents: eventToDelete
                  ? [
                      ...deletedEvents,
                      eventToDelete,
                    ]
                  : deletedEvents,
                currentEvent:
                  currentEvent?._id === id
                    ? null
                    : currentEvent,
              });
            } else {
              throw new Error(
                response.message ||
                  "Failed to delete event"
              );
            }
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to delete event";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        restoreEvent: async (id: string) => {
          set({ loading: true, error: null });
          try {
            const response =
              await eventApi.restoreEvent(id);
            if (
              response.success &&
              response.event
            ) {
              const deletedEvents =
                get().deletedEvents;
              const currentEvents = get().events;
              set({
                deletedEvents:
                  deletedEvents.filter(
                    (event) => event._id !== id
                  ),
                events: [
                  ...currentEvents,
                  response.event,
                ],
              });
            } else {
              throw new Error(
                response.message ||
                  "Failed to restore event"
              );
            }
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to restore event";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        hardDeleteEvent: async (id: string) => {
          set({ loading: true, error: null });
          try {
            const response =
              await eventApi.hardDeleteEvent(id);
            if (response.success) {
              const deletedEvents =
                get().deletedEvents;
              set({
                deletedEvents:
                  deletedEvents.filter(
                    (event) => event._id !== id
                  ),
              });
            } else {
              throw new Error(
                response.message ||
                  "Failed to permanently delete event"
              );
            }
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to permanently delete event";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        uploadImages: async (
          id: string,
          files: File[]
        ) => {
          set({ loading: true, error: null });
          try {
            const response =
              await eventApi.uploadEventImages(
                id,
                files
              );
            if (
              response.success &&
              response.event
            ) {
              set({
                currentEvent: response.event,
              });
            } else {
              throw new Error(
                response.message ||
                  "Failed to upload images"
              );
            }
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to upload images";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        removeImage: async (
          eventId: string,
          imageId: string
        ) => {
          set({ loading: true, error: null });
          try {
            const response =
              await eventApi.removeEventImage(
                eventId,
                imageId
              );
            if (
              response.success &&
              response.event
            ) {
              set({
                currentEvent: response.event,
              });
            } else {
              throw new Error(
                response.message ||
                  "Failed to remove image"
              );
            }
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to remove image";
            set({ error: errorMessage });
            throw err;
          } finally {
            set({ loading: false });
          }
        },

        clearError: () => set({ error: null }),
        clearCurrentEvent: () =>
          set({ currentEvent: null }),
      }),
      {
        name: "event-storage",
        partialize: (state) => ({
          events: state.events,
          deletedEvents: state.deletedEvents,
          currentEvent: state.currentEvent,
        }),
      }
    )
  );
