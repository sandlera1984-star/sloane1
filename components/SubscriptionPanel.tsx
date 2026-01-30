"use client";

import { useState } from "react";

export default function SubscriptionPanel({
  status,
  subscriptionId
}: {
  status: string;
  subscriptionId: string | null;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!subscriptionId) return;
    setLoading(true);
    const response = await fetch("/api/stripe/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId })
    });

    if (response.ok) {
      setMessage("Subscription canceled. Access will end immediately.");
    } else {
      setMessage("Unable to cancel subscription.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-6 space-y-4 text-sm text-plum">
      <div className="rounded-2xl border border-rose/30 p-4">
        <p className="font-semibold">Plan</p>
        <p>Exclusive Monthly — CAD $5.00</p>
        <p className="mt-2 text-xs uppercase tracking-widest text-plum/60">Status: {status}</p>
      </div>
      <button
        type="button"
        onClick={handleCancel}
        disabled={loading || !subscriptionId}
        className="rounded-full border border-rose/40 px-5 py-2 text-sm text-plum disabled:opacity-50"
      >
        Cancel subscription
      </button>
      {message && <p className="text-sm text-plum/70">{message}</p>}
    </div>
  );
}
