"use client";

import { getBrands } from "@/frontend/catalog";
import type { ProductFilters, StockStatus } from "@/lib/models";
import { CloseIcon } from "@/frontend/icons";

type Props = {
  filters: ProductFilters;
  colors: string[];
  open: boolean;
  onClose: () => void;
  onChange: (filters: ProductFilters) => void;
};

function toggle(list: string[] | undefined, value: string): string[] {
  const current = list ?? [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function Check() {
  return <span className="check" aria-hidden="true" />;
}

export function FilterPanel({ filters, colors, open, onClose, onChange }: Props) {
  const brands = getBrands();
  if (!open) return null;

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Filters">
      <button className="drawer-backdrop" aria-label="Close filters" onClick={onClose} />
      <aside className="drawer-panel filters">
        <div className="drawer-head">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            Filter
          </h2>
          <button className="icon-btn" type="button" aria-label="Close filters" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="filter-body">
          <div className="filter-group">
            <p>Brand</p>
            {brands.map((brand) => (
              <label key={brand.id}>
                <input
                  type="checkbox"
                  checked={filters.brand?.includes(brand.id) ?? false}
                  onChange={() => onChange({ ...filters, brand: toggle(filters.brand, brand.id) })}
                />
                <Check />
                {brand.name}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <p>Type</p>
            {["sunglasses", "optical"].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={filters.type?.includes(type) ?? false}
                  onChange={() => onChange({ ...filters, type: toggle(filters.type, type) })}
                />
                <Check />
                {type === "sunglasses" ? "Sunglasses" : "Optical"}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <p>Color</p>
            {colors.map((color) => (
              <label key={color}>
                <input
                  type="checkbox"
                  checked={filters.color?.includes(color) ?? false}
                  onChange={() => onChange({ ...filters, color: toggle(filters.color, color) })}
                />
                <Check />
                {color.replace(/-/g, " ")}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <p>Availability</p>
            <label>
              <input
                type="checkbox"
                checked={filters.availability === "in_stock"}
                onChange={() =>
                  onChange({
                    ...filters,
                    availability: filters.availability === "in_stock" ? undefined : ("in_stock" as StockStatus),
                  })
                }
              />
              <Check />
              In stock
            </label>
          </div>
        </div>
        <div className="filter-actions">
          <button className="text-link" type="button" onClick={() => onChange({})}>
            Clear all
          </button>
          <button className="btn" type="button" onClick={onClose}>
            View frames
          </button>
        </div>
      </aside>
    </div>
  );
}
