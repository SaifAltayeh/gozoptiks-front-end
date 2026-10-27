"use client";

import type { SortKey } from "@/lib/models";

const options: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "alpha", label: "Alphabetical" },
];

export function SortControl({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (value: SortKey) => void;
}) {
  return (
    <label className="sort">
      Sort
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SortKey)}
        aria-label="Sort products"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
