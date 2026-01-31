'use client';

import { Event } from '@/lib/api/events';
import { Calendar, MapPin, Star, Edit3, Trash2 } from 'lucide-react';

interface Props {
  event: Event;
  viewMode: 'grid' | 'list';
  onView: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export default function EventCard({
  event,
  viewMode,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const cover = event.files?.[0]?.url || '/placeholder.jpg';

  const progress =
    event.goalAmount > 0
      ? Math.min((event.raisedAmount / event.goalAmount) * 100, 100)
      : 0;

  return (
    <div
      onClick={() => onView(event)}
      className={`bg-white rounded-2xl shadow hover:shadow-xl transition cursor-pointer overflow-hidden ${
        viewMode === 'list' ? 'flex gap-4 p-4' : ''
      }`}
    >
      {/* Image */}
      <div className={viewMode === 'list' ? 'w-56 h-40' : 'h-52'}>
        <img src={cover} className="w-full h-full object-cover" />

        {event.isFeatured && (
          <span className="absolute m-3 bg-yellow-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star size={14} /> Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mt-1">
          {event.description}
        </p>

        <div className="flex gap-4 text-sm text-gray-500 mt-3">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {new Date(event.date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={16} />
            {event.location}
          </span>
        </div>

        {event.allowDonations && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>{event.currency} {event.raisedAmount}</span>
              <span>{event.currency} {event.goalAmount}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-blue-600 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            className="p-2 bg-blue-50 rounded"
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event._id);
            }}
            className="p-2 bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
