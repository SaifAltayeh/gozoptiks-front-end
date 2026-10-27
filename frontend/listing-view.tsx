"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product, ProductFilters, SortKey } from "@/lib/models";
import { filterProducts, getAvailableColors, getBrands, getCategories, sortProducts } from "@/frontend/catalog";
import { FilterPanel } from "@/frontend/filter-panel";
import { ProductGrid } from "@/frontend/product-grid";
import { SortControl } from "@/frontend/sort-control";

function parseList(value: string | null): string[] | undefined {
  if (!value) return undefined;
  return value.split(",").filter(Boolean);
}

export function ListingView({
  products,
  title,
  description,
  kicker,
}: {
  products: Product[];
  title: string;
  description?: string;
  kicker?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const brands = getBrands();
  const categories = getCategories();

  const brand = params.get("brand");
  const color = params.get("color");
  const type = params.get("type");
  const avail = params.get("avail");
  const sort = (params.get("sort") as SortKey) || "featured";

  const filters: ProductFilters = useMemo(
    () => ({
      brand: parseList(brand),
      color: parseList(color),
      type: parseList(type),
      availability: avail === "in_stock" ? "in_stock" : undefined,
    }),
    [brand, color, type, avail],
  );

  const colors = getAvailableColors(products);
  const visible = useMemo(() => sortProducts(filterProducts(products, filters), sort), [products, filters, sort]);
  const activeCount =
    (filters.brand?.length ?? 0) +
    (filters.color?.length ?? 0) +
    (filters.type?.length ?? 0) +
    (filters.availability ? 1 : 0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.toggle("lock", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body?.classList.remove("lock");
    };
  }, [open]);

  function write(nextFilters: ProductFilters, nextSort = sort) {
    const query = new URLSearchParams();
    if (nextFilters.brand?.length) query.set("brand", nextFilters.brand.join(","));
    if (nextFilters.color?.length) query.set("color", nextFilters.color.join(","));
    if (nextFilters.type?.length) query.set("type", nextFilters.type.join(","));
    if (nextFilters.availability) query.set("avail", nextFilters.availability);
    if (nextSort !== "featured") query.set("sort", nextSort);
    const suffix = query.toString();
    router.replace(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false });
  }

  const chips: { key: string; label: string; clear: () => void }[] = [];
  filters.brand?.forEach((id) => {
    chips.push({
      key: `brand-${id}`,
      label: brands.find((item) => item.id === id)?.name ?? id,
      clear: () => write({ ...filters, brand: filters.brand?.filter((item) => item !== id) }),
    });
  });
  filters.type?.forEach((id) => {
    chips.push({
      key: `type-${id}`,
      label: id === "sunglasses" ? "Sunglasses" : "Optical",
      clear: () => write({ ...filters, type: filters.type?.filter((item) => item !== id) }),
    });
  });
  filters.color?.forEach((id) => {
    chips.push({
      key: `color-${id}`,
      label: id.replace(/-/g, " "),
      clear: () => write({ ...filters, color: filters.color?.filter((item) => item !== id) }),
    });
  });
  if (filters.availability) {
    chips.push({
      key: "avail",
      label: "In stock",
      clear: () => write({ ...filters, availability: undefined }),
    });
  }

  return (
    <div className="shop">
      <header className="shop-head" data-reveal>
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <div className="shop-head-row">
          <h1 className="shop-title">{title}</h1>
          <p className="small">{visible.length} frames</p>
        </div>
        {description ? <p className="shop-lead">{description}</p> : null}
      </header>

      <nav className="shop-cats" aria-label="Categories" data-reveal>
        <Link href="/shop" aria-current={pathname === "/shop" ? "page" : undefined}>
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            aria-current={pathname === `/categories/${category.slug}` ? "page" : undefined}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      <div className="shop-toolbar">
        <button className="shop-filter-btn" type="button" onClick={() => setOpen(true)}>
          Filter{activeCount ? ` (${activeCount})` : ""}
        </button>
        <SortControl value={sort} onChange={(next) => write(filters, next)} />
      </div>

      {chips.length ? (
        <div className="shop-chips">
          {chips.map((chip) => (
            <button key={chip.key} className="shop-chip" type="button" onClick={chip.clear}>
              {chip.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <button className="text-link" type="button" onClick={() => write({})}>
            Clear
          </button>
        </div>
      ) : null}

      <FilterPanel
        filters={filters}
        colors={colors}
        open={open}
        onClose={() => setOpen(false)}
        onChange={write}
      />

      {products.length === 0 ? (
        <div className="empty" data-reveal>
          <h2 className="section-title">No frames for this brand yet.</h2>
          <p className="muted">Products will show here when they are added to the catalog.</p>
          <Link href="/shop" className="text-link">
            Shop all frames
          </Link>
        </div>
      ) : (
        <ProductGrid products={visible} />
      )}
    </div>
  );
}
