// lib/api/eventApi.ts - UPDATED VERSION
import api from "./api";
import {
  EventData,
  ApiResponse,
  PaginatedResponse,
} from "../types/event";

export const eventApi = {
  // CREATE: Create new event with file upload
  async createEvent(
    data: FormData | any
  ): Promise<ApiResponse<EventData>> {
    const isFormData = data instanceof FormData;

    const response = await api.post<
      ApiResponse<EventData>
    >(
      "/events",
      data,
      isFormData
        ? {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        : {}
    );
    return response.data;
  },

  // READ: Get events with filters
  async getEvents(
    params?: any
  ): Promise<PaginatedResponse> {
    const response =
      await api.get<PaginatedResponse>(
        "/events",
        { params }
      );
    return response.data;
  },

  // Get DELETED events only
  async getDeletedEvents(): Promise<PaginatedResponse> {
    const response =
      await api.get<PaginatedResponse>(
        "/events",
        {
          params: { deleted: true },
        }
      );
    return response.data;
  },

  // READ: Get single event
  async getEventById(
    id: string
  ): Promise<ApiResponse<EventData>> {
    const response = await api.get<
      ApiResponse<EventData>
    >(`/events/${id}`);
    return response.data;
  },

  // UPDATE: Update event with files
  async updateEvent(
    id: string,
    data: FormData | any
  ): Promise<ApiResponse<EventData>> {
    const isFormData = data instanceof FormData;

    const response = await api.put<
      ApiResponse<EventData>
    >(
      `/events/${id}`,
      data,
      isFormData
        ? {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        : {}
    );
    return response.data;
  },

  // SOFT DELETE
  async softDeleteEvent(
    id: string
  ): Promise<ApiResponse<EventData>> {
    const response = await api.delete<
      ApiResponse<EventData>
    >(`/events/soft/${id}`);
    return response.data;
  },

  // RESTORE
  async restoreEvent(
    id: string
  ): Promise<ApiResponse<EventData>> {
    const response = await api.patch<
      ApiResponse<EventData>
    >(`/events/restore/${id}`);
    return response.data;
  },

  // HARD DELETE
  async hardDeleteEvent(
    id: string
  ): Promise<ApiResponse<void>> {
    const response = await api.delete<
      ApiResponse<void>
    >(`/events/hard/${id}`);
    return response.data;
  },

  // Upload images
  async uploadEventImages(
    id: string,
    files: File[]
  ): Promise<ApiResponse<EventData>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post<
      ApiResponse<EventData>
    >(`/events/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Remove image
  async removeEventImage(
    eventId: string,
    imageId: string
  ): Promise<ApiResponse<EventData>> {
    const response = await api.delete<
      ApiResponse<EventData>
    >(`/events/${eventId}/images/${imageId}`);
    return response.data;
  },

  // Get event statistics
  async getEventStats(): Promise<any> {
    const response = await api.get(
      "/events/stats"
    );
    return response.data;
  },

  // Bulk actions
  async bulkActions(
    action: string,
    eventIds: string[]
  ): Promise<any> {
    const response = await api.post(
      "/events/bulk",
      {
        action,
        eventIds,
      }
    );
    return response.data;
  },
};
