"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "ws-cart-v1";

// Client-side cart (Context + localStorage). Prices here are for display only;
// the server re-prices everything at checkout (Phase 2) — never trust the client.
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration so we don't clobber stored data).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota/availability errors
    }
  }, [items, hydrated]);

  function addItem(item, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === item.key);
      const cap = item.stock ?? 99;
      if (existing) {
        return prev.map((i) =>
          i.key === item.key
            ? { ...i, ...item, qty: Math.min(i.qty + qty, cap) }
            : i,
        );
      }
      return [...prev, { ...item, qty: Math.min(qty, cap) }];
    });
  }

  function setQty(key, qty) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.key === key
            ? { ...i, qty: Math.max(0, Math.min(qty, i.stock ?? 99)) }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function clear() {
    setItems([]);
  }

  // Computed inline: the provider only re-renders when items/hydrated change.
  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const value = {
    items,
    count,
    subtotal,
    hydrated,
    addItem,
    setQty,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
