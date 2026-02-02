import { useState, useCallback } from "react";
import { eventApi } from "@/lib/api/eventApi";
import {
  CreateEventDTO,
  UpdateEventDTO,
  ApiResponse,
  EventData,
  PaginatedResponse,
} from "../types/event";

export const useEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = useCallback(
    async (data: CreateEventDTO | FormData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.createEvent(data);
        if (!response.success) {
          throw new Error(response.message || "Failed to create event");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to create event";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getEvents = useCallback(
    async (params?: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.getEvents(params);
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch events");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch events";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getDeletedEvents = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.getDeletedEvents();
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch deleted events");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch deleted events";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.getEventById(id);
        if (!response.success) {
          throw new Error(response.message || "Event not found");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch event";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateEvent = useCallback(
    async (id: string, data: UpdateEventDTO | FormData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.updateEvent(id, data);
        if (!response.success) {
          throw new Error(response.message || "Failed to update event");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to update event";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const softDeleteEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.softDeleteEvent(id);
        if (!response.success) {
          throw new Error(response.message || "Failed to delete event");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to delete event";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const restoreEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.restoreEvent(id);
        if (!response.success) {
          throw new Error(response.message || "Failed to restore event");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to restore event";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const hardDeleteEvent = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.hardDeleteEvent(id);
        if (!response.success) {
          throw new Error(response.message || "Failed to permanently delete event");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to permanently delete event";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const uploadImages = useCallback(
    async (id: string, files: File[]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.uploadEventImages(id, files);
        if (!response.success) {
          throw new Error(response.message || "Failed to upload images");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to upload images";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeImage = useCallback(
    async (eventId: string, imageId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.removeEventImage(eventId, imageId);
        if (!response.success) {
          throw new Error(response.message || "Failed to remove image");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to remove image";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const bulkRemoveImages = useCallback(
    async (eventId: string, imageIds: string[]) => {
      setLoading(true);
      setError(null);
      try {
        // Remove images one by one
        const results = [];
        for (const imageId of imageIds) {
          try {
            const response = await eventApi.removeEventImage(eventId, imageId);
            results.push(response);
          } catch (err) {
            console.error(`Failed to remove image ${imageId}:`, err);
          }
        }
        
        // Fetch updated event
        const updatedEvent = await eventApi.getEventById(eventId);
        return updatedEvent;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to remove images";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getEventStats = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.getEventStats();
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch event statistics");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch event statistics";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const bulkActions = useCallback(
    async (action: string, eventIds: string[]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await eventApi.bulkActions(action, eventIds);
        if (!response.success) {
          throw new Error(response.message || "Failed to perform bulk action");
        }
        return response;
      } catch (err: any) {
        const errorMessage = 
          err.response?.data?.message ||
          err.message ||
          "Failed to perform bulk action";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createEvent,
    getEvents,
    getDeletedEvents,
    getEvent,
    updateEvent,
    softDeleteEvent,
    restoreEvent,
    hardDeleteEvent,
    uploadImages,
    removeImage,
    bulkRemoveImages,
    getEventStats,
    bulkActions,
    clearError: () => setError(null),
  };
};

// Helper function to create FormData for event creation/update
export const createEventFormData = (
  data: CreateEventDTO | UpdateEventDTO,
  files?: File[],
  imagesToRemove?: string[]
): FormData => {
  const formData = new FormData();
  
  // Append all data fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false');
      } else if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  // Append images to remove
  if (imagesToRemove && imagesToRemove.length > 0) {
    formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
  }
  
  // Append new files
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('images', file);
    });
  }
  
  return formData;
};

// Helper function to prepare event data for API
export const prepareEventData = (formData: any) => {
  const data: any = { ...formData };
  
  // Convert string numbers to actual numbers
  if (data.maxParticipants) {
    data.maxParticipants = parseInt(data.maxParticipants) || 0;
  }
  if (data.goalAmount) {
    data.goalAmount = parseInt(data.goalAmount) || 0;
  }
  
  // Convert string booleans to actual booleans
  if (typeof data.allowDonations === 'string') {
    data.allowDonations = data.allowDonations === 'true';
  }
  if (typeof data.isFeatured === 'string') {
    data.isFeatured = data.isFeatured === 'true';
  }
  if (typeof data.isUrgent === 'string') {
    data.isUrgent = data.isUrgent === 'true';
  }
  
  // Handle empty strings for optional fields
  if (data.theme === '') {
    data.theme = undefined;
  }
  if (data.donationDeadline === '') {
    data.donationDeadline = undefined;
  }
  
  return data;
};