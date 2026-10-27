"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getBrandName, getProductById, getVariationState } from "@/frontend/catalog";
import { money } from "@/frontend/format";
import type { CartItem, Order, Product } from "@/lib/models";

const CART_KEY = "gozoptiks.cart";
const ORDER_KEY = "gozoptiks.lastOrder";

type AddPayload = {
  product: Product;
  quantity: number;
  variantId: string | null;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  ready: boolean;
  addItem: (payload: AddPayload) => { ok: boolean; message: string };
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  saveOrder: (order: Order) => void;
  readOrder: () => Order | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  notice: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setItems(readCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const flash = useCallback((message: string) => {
    setNotice(message);
  }, []);

  const addItem = useCallback(
    ({ product, quantity, variantId }: AddPayload) => {
      const variation = getVariationState(product, variantId);
      if (product.variations.some((item) => item.options.length > 1) && !variantId) {
        return { ok: false, message: "Select a variation to continue." };
      }
      if (!variation.available) {
        return { ok: false, message: "This variation is unavailable." };
      }

      const key = `${product.id}::${variantId ?? "default"}`;
      const max = variation.stockQuantity ?? 99;
      const brandName = getBrandName(product.brandId);

      setItems((current) => {
        const existing = current.find((item) => item.key === key);
        const nextQty = Math.min(max, (existing?.quantity ?? 0) + quantity);
        if (nextQty < 1) return current;
        const nextItem: CartItem = {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          brandName,
          image: variation.images[0] ?? product.images[0],
          quantity: nextQty,
          unitPrice: variation.price,
          variantLabel: variation.label,
          variantId,
          stockStatus: variation.stockStatus,
          stockQuantity: variation.stockQuantity,
        };
        if (existing) {
          return current.map((item) => (item.key === key ? nextItem : item));
        }
        return [...current, nextItem];
      });

      flash("Added to cart");
      setCartOpen(true);
      return { ok: true, message: "Added to cart" };
    },
    [flash],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) => {
          if (item.key !== key) return item;
          const max = item.stockQuantity ?? 99;
          const next = Math.min(max, Math.max(1, quantity));
          return { ...item, quantity: next };
        })
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
    flash("Removed from cart");
  }, [flash]);

  const clearCart = useCallback(() => setItems([]), []);

  const saveOrder = useCallback((order: Order) => {
    window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  }, []);

  const readOrder = useCallback((): Order | null => {
    try {
      const raw = window.sessionStorage.getItem(ORDER_KEY);
      return raw ? (JSON.parse(raw) as Order) : null;
    } catch {
      return null;
    }
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => money(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      ready,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      saveOrder,
      readOrder,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      navOpen,
      setNavOpen,
      notice,
    }),
    [
      items,
      itemCount,
      subtotal,
      ready,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      saveOrder,
      readOrder,
      cartOpen,
      searchOpen,
      navOpen,
      notice,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export function getProductStockCap(productId: string, variantId: string | null): number {
  const product = getProductById(productId);
  if (!product) return 0;
  return getVariationState(product, variantId).stockQuantity ?? 0;
}
