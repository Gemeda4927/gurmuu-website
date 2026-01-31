'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi, Event } from '@/lib/api/events';

export const useEvents = () => {
  const queryClient = useQueryClient();

  /* ===== FETCH ALL ===== */
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: eventsApi.getAll,
  });

  /* ===== FEATURED ===== */
  const { data: featuredEvents = [] } = useQuery<Event[]>({
    queryKey: ['featured-events'],
    queryFn: eventsApi.getFeatured,
  });

  /* ===== CREATE ===== */
  const createMutation = useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  /* ===== UPDATE ===== */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventsApi.update(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', vars.id] });
    },
  });

  /* ===== DELETE ===== */
  const deleteMutation = useMutation({
    mutationFn: eventsApi.softDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  /* ===== CLIENT SEARCH ===== */
  const searchEvents = (query: string): Event[] => {
    if (!query.trim()) return events;
    const q = query.toLowerCase();

    return events.filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  };

  return {
    events,
    featuredEvents,
    isLoading,
    error,
    refetchEvents: refetch,

    createEvent: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateEvent: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteEvent: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    searchEvents,
  };
};
