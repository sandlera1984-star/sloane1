"use client";

import { useState } from "react";

export default function AdminContentForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/admin/content", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      setStatus("Content saved.");
      form.reset();
    } else {
      setStatus("Unable to save content.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="w-full rounded-2xl border border-rose/30 px-4 py-3 text-sm"
        required
      />
      <select
        name="type"
        className="w-full rounded-2xl border border-rose/30 px-4 py-3 text-sm"
        required
      >
        <option value="photo">Photo</option>
        <option value="video">Video</option>
      </select>
      <input type="file" name="file" accept="image/*,video/*" required />
      <input type="file" name="thumbnail" accept="image/*" required />
      <label className="flex items-center gap-2 text-sm text-plum">
        <input type="checkbox" name="isLocked" defaultChecked className="h-4 w-4" />
        Locked for members only
      </label>
      <label className="flex items-center gap-2 text-sm text-plum">
        <input type="checkbox" name="publish" className="h-4 w-4" />
        Publish now
      </label>
      <label className="flex items-center gap-2 text-sm text-plum">
        <input type="checkbox" name="sendNotification" className="h-4 w-4" />
        Send notification email
      </label>
      <button type="submit" className="rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white">
        Save content
      </button>
      {status && <p className="text-sm text-plum/70">{status}</p>}
    </form>
  );
}
