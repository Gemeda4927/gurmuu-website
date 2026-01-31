'use client';

import { useState } from 'react';
import { Event } from '@/lib/api/events';

export default function EditEventModal({
  event,
  onClose,
  onSubmit,
  isLoading,
}: any) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>

        <input
          className="border w-full mb-3 px-4 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border w-full mb-4 px-4 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={isLoading}
            onClick={() => onSubmit({ title, description })}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
