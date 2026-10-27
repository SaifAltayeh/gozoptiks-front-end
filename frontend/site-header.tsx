"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getBrands, getStore } from "@/frontend/catalog";
import { useCart } from "@/frontend/cart-context";
import { BackButton } from "@/frontend/back-button";
import { BagIcon, MenuIcon, SearchIcon } from "@/frontend/icons";

export function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";
  const store = getStore();
  const brands = getBrands();
  const [scrolled, setScrolled] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { itemCount, setSearchOpen, setCartOpen, setNavOpen } = useCart();

  useEffect(() => {
    if (!home) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  useEffect(() => {
    setBrandsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!brandsOpen) return;
    const onDoc = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".dropdown")) setBrandsOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBrandsOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [brandsOpen]);

  function openBrands() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setBrandsOpen(true);
  }

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setBrandsOpen(false), 220);
  }

  return (
    <header className={`header ${home ? "is-overlay" : ""} ${home && scrolled ? "is-solid" : ""}`}>
      <div className="header-inner">
        <div className="header-left">
          {home ? null : <BackButton fallback="/" />}
          <button className="icon-btn menu-btn" type="button" aria-label="Open menu" onClick={() => setNavOpen(true)}>
            <MenuIcon />
          </button>
        </div>

        <nav className="nav" aria-label="Primary">
          <Link href="/shop" className="nav-btn" aria-current={pathname === "/shop" ? "page" : undefined}>
            Shop
          </Link>
          <Link href="/about" className="nav-btn" aria-current={pathname.startsWith("/about") ? "page" : undefined}>
            About
          </Link>
          <Link href="/categories" className="nav-btn" aria-current={pathname.startsWith("/categories") ? "page" : undefined}>
            Categories
          </Link>
          <div
            className={`dropdown ${brandsOpen ? "is-open" : ""}`}
            onMouseEnter={openBrands}
            onMouseLeave={scheduleClose}
          >
            <button
              className="nav-btn"
              type="button"
              aria-expanded={brandsOpen}
              aria-haspopup="true"
              aria-controls="brands-menu"
              onClick={() => setBrandsOpen((open) => !open)}
            >
              Brands
            </button>
            <div id="brands-menu" className="dropdown-panel" role="menu">
              {brands.map((brand) => (
                <Link key={brand.id} href={`/brands/${brand.slug}`} role="menuitem">
                  {brand.name}
                </Link>
              ))}
              <Link href="/brands" role="menuitem">
                All brands
              </Link>
            </div>
          </div>
        </nav>

        <Link href="/" className="wordmark" aria-label={`${store.wordmark} home`}>
          {store.wordmark}
        </Link>

        <div className="header-actions">
          <button className="icon-btn" type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <SearchIcon />
          </button>
          <button className="icon-btn" type="button" aria-label="Open cart" onClick={() => setCartOpen(true)}>
            <BagIcon />
            {itemCount > 0 ? <span className="cart-count">{itemCount}</span> : null}
          </button>
        </div>
      </div>
    </header>
  );
}
