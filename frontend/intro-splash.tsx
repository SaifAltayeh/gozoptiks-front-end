"use client";

import { useEffect, useState } from "react";
import { getStore } from "@/frontend/catalog";

const STORAGE_KEY = "goz-intro";

export function IntroSplash() {
  const store = getStore();
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-done")) {
      setVisible(false);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 500 : 2000;
    const fade = reduced ? 250 : 800;

    const exitTimer = window.setTimeout(() => setExiting(true), hold);
    const doneTimer = window.setTimeout(() => {
      document.documentElement.classList.add("intro-done");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setVisible(false);
    }, hold + fade);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`intro-splash ${exiting ? "is-exit" : ""}`} role="status" aria-live="polite">
      <img src="/logo.jpeg" alt={store.wordmark} className="intro-logo" width={640} height={640} />
    </div>
  );
}
