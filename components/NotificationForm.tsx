"use client";

import { useState } from "react";

export default function NotificationForm({ initialOptIn }: { initialOptIn: boolean }) {
  const [optedIn, setOptedIn] = useState(initialOptIn);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optedIn })
    });

    if (response.ok) {
      setMessage("Preferences saved.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="flex items-center gap-2 text-sm text-plum">
        <input
          type="checkbox"
          checked={optedIn}
          onChange={(event) => setOptedIn(event.target.checked)}
          className="h-4 w-4 rounded border-rose"
        />
        Email me when new content is posted
      </label>
      <button
        type="submit"
        className="rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white"
      >
        Save preferences
      </button>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}
