"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 border-t border-[var(--border)]"
      style={{ background: "rgba(10,11,20,0.97)", backdropFilter: "blur(16px)" }}>
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-xs text-[var(--text-muted)] flex-1">
          We use cookies and analytics to improve your experience and show relevant ads. By continuing, you agree to our{" "}
          <a href="/privacy" className="text-gold-400 hover:underline">Privacy Policy</a>.
        </p>
        <button onClick={accept}
          className="gold-btn text-xs px-6 py-2 rounded-lg whitespace-nowrap">
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
