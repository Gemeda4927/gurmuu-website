'use client';

import { Event } from '@/lib/api/events';

export default function EventDetailsModal({
  event,
  onClose,
  onEdit,
  onDelete,
}: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {event.files?.map((f: any) => (
            <img key={f._id} src={f.url} className="rounded-lg" />
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onEdit}>Edit</button>
          <button
            onClick={() => onDelete(event._id)}
            className="text-red-600"
          >
            Delete
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
