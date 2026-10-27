"use client";

import Link from "next/link";
import { useCart } from "@/frontend/cart-context";
import { formatPrice } from "@/frontend/format";
import { CartItem } from "@/frontend/cart-item";
import { EmptyState } from "@/frontend/empty-state";

export function CartPageView() {
  const { items, subtotal, updateQuantity, removeItem, ready } = useCart();
  const count = items.reduce((total, item) => total + item.quantity, 0);

  if (!ready) {
    return (
      <div className="cart-page">
        <header className="shop-head">
          <h1 className="shop-title">Cart</h1>
        </header>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty."
        text="Browse the catalog and add a frame when you find one."
        href="/shop"
        cta="Shop frames"
      />
    );
  }

  return (
    <div className="cart-page" data-reveal>
      <header className="shop-head">
        <div className="shop-head-row">
          <h1 className="shop-title">Cart</h1>
          <p className="small">
            {count} {count === 1 ? "frame" : "frames"}
          </p>
        </div>
      </header>
      <div className="checkout">
        <div className="cart-page-list">
          {items.map((item) => (
            <CartItem
              key={item.key}
              item={item}
              onQuantity={(quantity) => updateQuantity(item.key, quantity)}
              onRemove={() => removeItem(item.key)}
            />
          ))}
        </div>
        <aside className="summary cart-summary">
          <p className="kicker">Summary</p>
          <div className="totals">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <p className="small">Shipping is selected at checkout. No tax has been configured.</p>
          <Link href="/checkout" className="btn btn-full">
            Checkout as guest
          </Link>
          <Link href="/shop" className="text-link">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
