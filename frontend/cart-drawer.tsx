"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/frontend/cart-context";
import { formatPrice } from "@/frontend/format";
import { CartItem } from "@/frontend/cart-item";
import { CloseIcon } from "@/frontend/icons";

export function CartDrawer() {
  const { cartOpen, setCartOpen, items, subtotal, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.toggle("lock", cartOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body?.classList.remove("lock");
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Cart">
      <button className="drawer-backdrop" aria-label="Close cart" onClick={() => setCartOpen(false)} />
      <div className="drawer-panel">
        <div className="drawer-head">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            Cart
          </h2>
          <button className="icon-btn" type="button" aria-label="Close cart" onClick={() => setCartOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="empty">
            <p>Your cart is empty.</p>
            <Link href="/shop" className="btn" onClick={() => setCartOpen(false)}>
              Shop frames
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <CartItem
                  key={item.key}
                  item={item}
                  onQuantity={(quantity) => updateQuantity(item.key, quantity)}
                  onRemove={() => removeItem(item.key)}
                />
              ))}
            </div>
            <div className="cart-foot">
              <div className="totals">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className="small">Shipping is calculated at checkout. Demo rates only.</p>
              <Link href="/cart" className="btn btn-ghost btn-full" onClick={() => setCartOpen(false)}>
                View cart
              </Link>
              <Link href="/checkout" className="btn btn-full" onClick={() => setCartOpen(false)}>
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
