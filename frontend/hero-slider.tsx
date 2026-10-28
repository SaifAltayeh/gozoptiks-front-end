"use client";

import { MediaImage as Image } from "@/frontend/media-image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HomepageHeroSlide } from "@/lib/models";

export function HeroSlider({ slides }: { slides: HomepageHeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

  const go = useCallback(
    (next: number) => {
      setIndex((current) => (current + next + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduced) return;
    const timer = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(timer);
  }, [go, paused]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!slide) return null;

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(event) => {
        const x = event.changedTouches[0]?.clientX ?? 0;
        (event.currentTarget as HTMLElement).dataset.touchX = String(x);
      }}
      onTouchEnd={(event) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest("a, button")) return;
        const start = Number((event.currentTarget as HTMLElement).dataset.touchX ?? 0);
        const dx = (event.changedTouches[0]?.clientX ?? 0) - start;
        if (dx > 50) go(-1);
        if (dx < -50) go(1);
      }}
      aria-roledescription="carousel"
      aria-label="Featured campaigns"
    >
      <div className="hero-stage">
        {slides.map((item, itemIndex) => (
          <div
            key={item.id}
            className={`hero-slide ${itemIndex === index ? "is-active" : ""}`}
            aria-hidden={itemIndex !== index}
          >
            <Image
              src={item.image}
              alt={item.heading}
              fill
              priority={itemIndex === 0}
              quality={100}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: item.imagePosition }}
            />
          </div>
        ))}
      </div>

      <div className="hero-ui">
        <div className="hero-copy" key={slide.id}>
          {slide.campaign ? <p className="hero-campaign">{slide.campaign}</p> : null}
          <h1 className="hero-heading" aria-live="polite">
            {slide.heading}
          </h1>
          {slide.text ? <p className="hero-sub">{slide.text}</p> : null}
          <Link href={slide.ctaHref} className="hero-cta">
            {slide.ctaLabel}
          </Link>
          <div className="hero-dots">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to ${item.heading}`}
                aria-current={itemIndex === index}
                onClick={() => setIndex(itemIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
