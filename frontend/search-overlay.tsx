"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { searchProducts, getBrandName } from "@/frontend/catalog";
import { formatPrice } from "@/frontend/format";
import { useCart } from "@/frontend/cart-context";
import { CloseIcon } from "@/frontend/icons";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useCart();
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = useMemo(() => searchProducts(query).slice(0, 8), [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.toggle("lock", searchOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body?.classList.remove("lock");
    };
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Search">
      <button className="overlay-backdrop" aria-label="Close search" onClick={() => setSearchOpen(false)} />
      <div className="search-panel">
        <form
          className="search-row"
          onSubmit={(event) => {
            event.preventDefault();
            const value = query.trim();
            setSearchOpen(false);
            router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
          }}
        >
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search frames, brands, categories"
            aria-label="Search products"
          />
          <button className="icon-btn" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
            <CloseIcon />
          </button>
        </form>
        {!query.trim() ? (
          <p className="small" style={{ marginTop: "1rem" }}>
            Try Andy, Astoria, Barner, or optical.
          </p>
        ) : results.length === 0 ? (
          <p className="small" style={{ marginTop: "1rem" }}>
            No products match “{query}”.
          </p>
        ) : (
          <div className="search-results">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="search-result"
                onClick={() => setSearchOpen(false)}
              >
                <Image src={product.images[0]} alt={product.name} width={72} height={96} />
                <span>
                  <strong style={{ display: "block", fontWeight: 500 }}>{product.name}</strong>
                  <span className="small">{getBrandName(product.brandId)}</span>
                </span>
                <span>{formatPrice(product.price)}</span>
              </Link>
            ))}
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              className="text-link"
              style={{ marginTop: "1rem" }}
              onClick={() => setSearchOpen(false)}
            >
              View all results
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
