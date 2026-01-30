"use client";

import { useState } from "react";

interface TermsModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function TermsModal({ open, onConfirm, onClose }: TermsModalProps) {
  const [agreed, setAgreed] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-plum/50 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-plum">Terms & Conditions</h2>
        <div className="mt-4 space-y-3 text-sm text-plum/80">
          <p>By subscribing, you agree to recurring billing of CAD $5.00 per month. Your subscription renews automatically until you cancel.</p>
          <p>You authorize us to charge your payment method for each billing cycle. You can cancel anytime from your account subscription settings.</p>
          <p>No refunds or prorations are offered unless required by applicable law. Service is provided “as is” without guarantees of uninterrupted access.</p>
          <p>Our liability is limited to the fullest extent permitted by law; we are not responsible for indirect or consequential damages.</p>
          <p>You agree to use the service in compliance with acceptable use standards and indemnify us against misuse or violations.</p>
          <p>Chargebacks or payment disputes should be raised with support first; unresolved disputes may result in account suspension.</p>
          <p>We handle your data as described in our Privacy Policy. Contact us at support@exclusive.app.</p>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-plum">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="h-4 w-4 rounded border-rose"
          />
          I agree to the Terms & Conditions and Privacy Policy.
        </label>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-rose/40 px-4 py-2 text-sm text-plum"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!agreed}
            onClick={onConfirm}
            className="rounded-full bg-plum px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
}
