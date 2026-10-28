"use client";

import { MediaImage as Image } from "@/frontend/media-image";
import { useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = images[index] ?? images[0];

  return (
    <div className="gallery">
      <button
        className={`gallery-main ${zoomed ? "zoomed" : ""}`}
        type="button"
        onClick={() => setZoomed((value) => !value)}
        aria-label={zoomed ? "Exit zoom" : "Zoom image"}
      >
        {current ? (
          <Image src={current} alt={alt} width={900} height={1200} priority sizes="(max-width: 860px) 100vw, 55vw" />
        ) : null}
      </button>
      {images.length > 1 ? (
        <div className="thumbs">
          {images.map((image, imageIndex) => (
            <button
              key={image}
              type="button"
              aria-label={`View image ${imageIndex + 1}`}
              aria-current={imageIndex === index}
              onClick={() => {
                setIndex(imageIndex);
                setZoomed(false);
              }}
            >
              <Image src={image} alt="" width={140} height={186} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
