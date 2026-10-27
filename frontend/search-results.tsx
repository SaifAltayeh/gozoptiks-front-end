"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchProducts } from "@/frontend/catalog";
import { ProductGrid } from "@/frontend/product-grid";
import { EmptyState } from "@/frontend/empty-state";

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [value, setValue] = useState(initial);
  const query = initial.trim();
  const results = useMemo(() => (query ? searchProducts(query) : []), [query]);

  return (
    <div>
      <div className="page-head" data-reveal>
        <div>
          <p className="kicker">Search</p>
          <h1 className="display">{query ? `Results for “${query}”` : "Search"}</h1>
        </div>
        <p className="small">{query ? `${results.length} products` : ""}</p>
      </div>
      <form
        className="search-row"
        onSubmit={(event) => {
          event.preventDefault();
          router.push(value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/search");
        }}
      >
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search frames, brands, categories"
          aria-label="Search products"
        />
        {value ? (
          <button
            className="remove"
            type="button"
            onClick={() => {
              setValue("");
              router.push("/search");
            }}
          >
            Clear
          </button>
        ) : null}
      </form>
      {!query ? (
        <EmptyState title="Start a search." text="Try Andy, Astoria, Barner, or optical." />
      ) : results.length === 0 ? (
        <EmptyState title="No matching frames." text={`Nothing in the catalog matches “${query}”.`} href="/shop" cta="Browse the shop" />
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <ProductGrid products={results} />
        </div>
      )}
    </div>
  );
}
