"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { useCart } from "@/lib/cart/cart-context";
import { computeShipping } from "@/lib/checkout";
import { formatINR } from "@/lib/money";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Field({ label, name, value, onChange, className, ...props }) {
  return (
    <label className={`flex flex-col gap-stack-xs ${className ?? ""}`}>
      <span className="font-label-md text-label-md text-on-surface">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-stack-sm py-stack-sm font-body-md text-body-md text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cubic-transition"
        {...props}
      />
    </label>
  );
}

export function CheckoutClient({ email = "", configured = true }) {
  const router = useRouter();
  const { items, subtotal, hydrated, clear } = useCart();
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email,
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = computeShipping(subtotal);
  const total = subtotal + shipping;

  function set(field) {
    return (e) => setAddress((a) => ({ ...a, [field]: e.target.value }));
  }

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })),
          address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed.");

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Could not load the payment window.");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "WS CubeTech Store",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: data.prefill,
        theme: { color: "#0051d5" },
        handler: async (resp) => {
          try {
            const vr = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderId, ...resp }),
            });
            clear();
            router.push(
              vr.ok
                ? `/orders/${data.orderId}?success=1`
                : `/orders/${data.orderId}`,
            );
          } catch {
            router.push(`/orders/${data.orderId}`);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <p className="font-body-md text-body-md text-on-surface-variant">
        Loading…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-stack-xl">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Your cart is empty.
        </p>
        <Link
          href="/shop"
          className={buttonClasses({ className: "rounded-full mt-stack-md" })}
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handlePay}
      className="grid lg:grid-cols-3 gap-gutter items-start"
    >
      {/* Shipping address */}
      <div className="lg:col-span-2 glass-card rounded-xl p-stack-md flex flex-col gap-stack-sm">
        <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
          Shipping address
        </h2>
        <div className="grid sm:grid-cols-2 gap-stack-sm">
          <Field
            label="Full name"
            name="fullName"
            value={address.fullName}
            onChange={set("fullName")}
            required
            autoComplete="name"
          />
          <Field
            label="Phone"
            name="phone"
            value={address.phone}
            onChange={set("phone")}
            required
            autoComplete="tel"
          />
        </div>
        <Field
          label="Email"
          name="email"
          type="email"
          value={address.email}
          onChange={set("email")}
          required
          autoComplete="email"
        />
        <Field
          label="Address line 1"
          name="line1"
          value={address.line1}
          onChange={set("line1")}
          required
          autoComplete="address-line1"
        />
        <Field
          label="Address line 2 (optional)"
          name="line2"
          value={address.line2}
          onChange={set("line2")}
          autoComplete="address-line2"
        />
        <div className="grid sm:grid-cols-3 gap-stack-sm">
          <Field
            label="City"
            name="city"
            value={address.city}
            onChange={set("city")}
            required
            autoComplete="address-level2"
          />
          <Field
            label="State"
            name="state"
            value={address.state}
            onChange={set("state")}
            required
            autoComplete="address-level1"
          />
          <Field
            label="PIN code"
            name="pincode"
            value={address.pincode}
            onChange={set("pincode")}
            required
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </div>
      </div>

      {/* Summary */}
      <aside className="glass-card rounded-xl p-stack-md flex flex-col gap-stack-sm">
        <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
          Order summary
        </h2>
        <div className="flex flex-col gap-stack-xs">
          {items.map((i) => (
            <div
              key={i.key}
              className="flex justify-between gap-2 font-body-md text-body-md"
            >
              <span className="text-on-surface-variant truncate">
                {i.name} × {i.qty}
              </span>
              <span className="text-on-surface whitespace-nowrap">
                {formatINR(i.price * i.qty)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-outline-variant/20 pt-stack-sm flex flex-col gap-stack-xs">
          <Row label="Subtotal" value={formatINR(subtotal)} />
          <Row
            label="Shipping"
            value={shipping === 0 ? "Free" : formatINR(shipping)}
          />
          <div className="flex justify-between font-label-md text-label-md text-on-surface pt-stack-xs">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
        </div>

        {error && (
          <p className="font-label-md text-label-md text-error">{error}</p>
        )}
        {!configured && (
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Payments aren't configured yet (set Razorpay keys in .env.local).
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || !configured}
          className="rounded-lg w-full mt-stack-xs"
        >
          {loading ? "Processing…" : `Pay ${formatINR(total)}`}
        </Button>
        <Link
          href="/cart"
          className="text-center font-label-sm text-label-sm text-secondary hover:underline"
        >
          Back to cart
        </Link>
      </aside>
    </form>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
