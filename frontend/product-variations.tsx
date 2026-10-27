"use client";

import type { ProductVariation } from "@/lib/models";

export function ProductVariations({
  variations,
  selected,
  onSelect,
}: {
  variations: ProductVariation[];
  selected: Record<string, string>;
  onSelect: (variationId: string, optionId: string) => void;
}) {
  if (!variations.length) return null;

  return (
    <div className="pdp-variants">
      {variations.map((variation) => (
        <div key={variation.id} className="pdp-variant-group">
          <p className="kicker">{variation.name}</p>
          <div className="variant-row">
            {variation.options.map((option) => (
              <button
                key={option.id}
                className="variant"
                type="button"
                aria-pressed={selected[variation.id] === option.id}
                disabled={!option.available}
                onClick={() => onSelect(variation.id, option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
