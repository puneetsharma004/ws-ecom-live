"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/lib/cart/cart-context";
import { formatINR } from "@/lib/money";

function CartRow({ item, setQty, removeItem }) {
  return (
    <div className="flex gap-stack-sm p-stack-sm bg-surface-container-lowest rounded-xl border border-outline-variant/20">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container-low shrink-0">
        {item.image?.url ? (
          // biome-ignore lint/performance/noImgElement: remote catalog image (Storage/CDN URL)
          <img
            src={item.image.url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <Icon name="image" />
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="font-label-md text-label-md text-on-surface hover:text-secondary transition-colors"
        >
          {item.name}
        </Link>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {item.variantLabel}
        </p>
        <div className="flex items-center gap-stack-sm mt-stack-xs">
          <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty(item.key, item.qty - 1)}
              className="px-2 py-1 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            >
              <Icon name="remove" className="text-[18px]" />
            </button>
            <span className="px-3 font-label-md text-label-md text-primary">
              {item.qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty(item.key, item.qty + 1)}
              className="px-2 py-1 text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            >
              <Icon name="add" className="text-[18px]" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-right font-label-md text-label-md text-on-surface whitespace-nowrap">
        {formatINR(item.price * item.qty)}
      </div>
    </div>
  );
}

export function CartView() {
  const { items, subtotal, setQty, removeItem, clear, hydrated } = useCart();

  if (!hydrated) {
    return (
      <p className="font-body-md text-body-md text-on-surface-variant">
        Loading your cart…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-stack-xl">
        <Icon name="shopping_cart" className="text-[48px] text-outline" />
        <p className="font-body-md text-body-md text-on-surface-variant mt-stack-sm">
          Your cart is empty.
        </p>
        <Link
          href="/shop"
          className={buttonClasses({
            className: "rounded-full mt-stack-md",
          })}
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-gutter items-start">
      <div className="lg:col-span-2 flex flex-col gap-stack-sm">
        {items.map((item) => (
          <CartRow
            key={item.key}
            item={item}
            setQty={setQty}
            removeItem={removeItem}
          />
        ))}
        <button
          type="button"
          onClick={clear}
          className="self-start mt-stack-xs font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors"
        >
          Clear cart
        </button>
      </div>

      <aside className="glass-card rounded-xl p-stack-md flex flex-col gap-stack-sm">
        <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
          Order summary
        </h2>
        <div className="flex justify-between font-body-md text-body-md text-on-surface">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Shipping calculated at checkout.
        </p>
        <Link
          href="/checkout"
          className={buttonClasses({
            className: "rounded-lg w-full mt-stack-xs",
          })}
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/shop"
          className="text-center font-label-sm text-label-sm text-secondary hover:underline"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
