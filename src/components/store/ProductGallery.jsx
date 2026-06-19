"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0] ?? null;

  return (
    <div className="flex flex-col gap-stack-sm">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-lowest ambient-shadow">
        {main ? (
          // biome-ignore lint/performance/noImgElement: remote catalog image (Storage/CDN URL)
          <img
            src={main.url}
            alt={main.alt || name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <Icon name="image" className="text-[64px]" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-stack-sm">
          {images.map((img, i) => (
            <button
              type="button"
              key={img.id}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                i === active
                  ? "border-primary"
                  : "border-transparent hover:border-outline-variant opacity-70 hover:opacity-100",
              )}
            >
              {/* biome-ignore lint/performance/noImgElement: remote catalog image (Storage/CDN URL) */}
              <img
                src={img.url}
                alt={img.alt || name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
