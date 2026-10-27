"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getBrands, getCategories, getStore } from "@/frontend/catalog";
import { useCart } from "@/frontend/cart-context";
import { CloseIcon } from "@/frontend/icons";

export function MobileNav() {
  const { navOpen, setNavOpen, setSearchOpen } = useCart();
  const store = getStore();
  const brands = getBrands();
  const categories = getCategories();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.toggle("lock", navOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body?.classList.remove("lock");
    };
  }, [navOpen, setNavOpen]);

  if (!navOpen) return null;

  return (
    <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu">
      <button className="mobile-backdrop" aria-label="Close menu" onClick={() => setNavOpen(false)} />
      <div className="mobile-panel">
        <div className="mobile-head">
          <span className="wordmark">{store.wordmark}</span>
          <button className="icon-btn" type="button" aria-label="Close menu" onClick={() => setNavOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <nav className="mobile-links">
          <Link href="/shop" onClick={() => setNavOpen(false)}>
            Shop
          </Link>
          <Link href="/about" onClick={() => setNavOpen(false)}>
            About
          </Link>
          <div className="mobile-group">
            <Link href="/categories" onClick={() => setNavOpen(false)}>
              Categories
            </Link>
            <div className="mobile-sub">
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`} onClick={() => setNavOpen(false)}>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="mobile-group">
            <Link href="/brands" onClick={() => setNavOpen(false)}>
              Brands
            </Link>
            <div className="mobile-sub">
              {brands.map((brand) => (
                <Link key={brand.id} href={`/brands/${brand.slug}`} onClick={() => setNavOpen(false)}>
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/contact" onClick={() => setNavOpen(false)}>
            Contact
          </Link>
          <button
            type="button"
            onClick={() => {
              setNavOpen(false);
              setSearchOpen(true);
            }}
          >
            Search
          </button>
        </nav>
      </div>
    </div>
  );
}
