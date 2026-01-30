"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import TermsModal from "@/components/TermsModal";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [showTerms, setShowTerms] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [error, setError] = useState("");
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const startSubscription = async () => {
    setError("");
    const response = await fetch("/api/stripe/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: customerEmail || email })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Unable to start subscription.");
      return null;
    }

    const data = await response.json();
    setClientSecret(data.clientSecret);
    setSubscriptionId(data.subscriptionId);
    setCustomerEmail(data.email || customerEmail);
    return data as { clientSecret: string; subscriptionId: string; email?: string };
  };

  const confirmPayment = async () => {
    if (!stripe || !elements) return;
    let secret = clientSecret;
    if (!secret) {
      const data = await startSubscription();
      if (!data) return;
      secret = data.clientSecret;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error: stripeError } = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: cardElement
      }
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      return;
    }

    setShowAccountModal(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowTerms(true);
  };

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email || customerEmail,
        password,
        subscriptionId
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Unable to create account.");
      return;
    }

    window.location.href = "/exclusive";
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-plum">Secure checkout</h1>
      <p className="mt-2 text-sm text-plum/70">$5 CAD per month. Cancel anytime.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="Email (optional)"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          className="w-full rounded-2xl border border-rose/30 px-4 py-3 text-sm"
        />
        <div className="rounded-2xl border border-rose/30 px-4 py-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white"
        >
          Continue
        </button>
      </form>
      <TermsModal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        onConfirm={async () => {
          setShowTerms(false);
          await confirmPayment();
        }}
      />
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-plum/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6">
            <h2 className="text-xl font-semibold text-plum">Create your account</h2>
            <div className="mt-4 space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email || customerEmail}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-rose/30 px-4 py-3 text-sm"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-rose/30 px-4 py-3 text-sm"
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-rose/30 px-4 py-3 text-sm"
                required
              />
              <button
                type="button"
                onClick={handleCreateAccount}
                className="w-full rounded-full bg-plum px-6 py-3 text-sm font-semibold text-white"
              >
                Create account & sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PayPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
