"use client";

import { useState } from "react";

export default function CreateEventModal({
  onClose,
  onSubmit,
  isLoading,
}: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Create Event
        </h2>

        <input
          className="border w-full mb-3 px-4 py-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          className="border w-full mb-4 px-4 py-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={() => {
              const fd = new FormData();
              fd.append("title", title);
              fd.append(
                "description",
                description
              );
              onSubmit(fd);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
