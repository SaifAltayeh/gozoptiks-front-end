"use client";

import type { Database } from "@/lib/types";
import { CatalogProvider } from "@/frontend/catalog-context";
import { CartProvider, useCart } from "@/frontend/cart-context";

function Notice() {
  const { notice } = useCart();
  if (!notice) return null;
  return (
    <div className="toast" role="status">
      {notice}
    </div>
  );
}

export function Providers({ catalog, children }: { catalog: Database; children: React.ReactNode }) {
  return (
    <CatalogProvider catalog={catalog}>
      <CartProvider>
        {children}
        <Notice />
      </CartProvider>
    </CatalogProvider>
  );
}
