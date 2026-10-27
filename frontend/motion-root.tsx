"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function revealAll() {
  document.querySelectorAll("[data-reveal]").forEach((node) => {
    node.classList?.add("is-in");
  });
}

function inView(node: Element) {
  const rect = node.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight + 120;
}

function watchReveals() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    revealAll();
    return () => undefined;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in", "is-animate");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0, rootMargin: "120px 0px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((node) => {
    if (node.classList.contains("is-in")) return;
    if (inView(node)) {
      node.classList.add("is-in");
      return;
    }
    io.observe(node);
  });

  const fallback = window.setTimeout(revealAll, 1600);

  return () => {
    window.clearTimeout(fallback);
    io.disconnect();
  };
}

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    let stop: (() => void) | undefined;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      stop = watchReveals();
    };

    if (document.documentElement.classList.contains("intro-done")) {
      start();
    }

    const mo = new MutationObserver(() => {
      if (document.documentElement.classList.contains("intro-done")) {
        start();
        mo.disconnect();
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mo.disconnect();
      stop?.();
    };
  }, [pathname]);

  return null;
}
