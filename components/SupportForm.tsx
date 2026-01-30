"use client";

import { useState } from "react";

export default function SupportForm({ email, name }: { email: string; name: string }) {
  const [formName, setFormName] = useState(name);
  const [formEmail, setFormEmail] = useState(email);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (message.split(/\s+/).length > 200) {
      setStatus("Please keep your issue under 200 words.");
      return;
    }
    const response = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formName, email: formEmail, message })
    });

    if (response.ok) {
      setStatus("Thank you for your submission.");
      setMessage("");
    } else {
      setStatus("Unable to submit support request.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={formName}
        onChange={(event) => setFormName(event.target.value)}
        className="w-full rounded-2xl border border-rose/30 px-4 py-3 text-sm"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formEmail}
        onChange={(event) => setFormEmail(event.target.value)}
        className="w-full rounded-2xl border border-rose/30 px-4 py-3 text-sm"
        required
      />
      <textarea
        placeholder="Describe the issue (max 200 words)"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={5}
        className="w-full rounded-2xl border border-rose/30 px-4 py-3 text-sm"
        required
      />
      <button
        type="submit"
        className="rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white"
      >
        Submit
      </button>
      {status && <p className="text-sm text-plum/70">{status}</p>}
    </form>
  );
}
