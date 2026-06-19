import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import { updateOrderStatus } from "@/lib/admin/actions";
import { getOrderById } from "@/lib/db/orders";
import { formatINR } from "@/lib/money";

export const metadata = { title: "Order" };

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default async function AdminOrderDetail({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const addr = order.shipping_address ?? {};
  const items = order.order_items ?? [];

  return (
    <div className="flex flex-col gap-stack-md max-w-3xl">
      <Link
        href="/admin/orders"
        className="font-label-sm text-label-sm text-secondary hover:underline"
      >
        ← All orders
      </Link>

      <div className="flex items-center justify-between gap-stack-sm">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            {order.order_number}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {order.email} · {new Date(order.created_at).toLocaleString("en-IN")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Status update */}
      <form
        action={updateOrderStatus}
        className="glass-card rounded-xl p-stack-md flex flex-wrap items-end gap-stack-sm"
      >
        <input type="hidden" name="id" value={order.id} />
        <label className="flex flex-col gap-stack-xs">
          <span className="font-label-md text-label-md text-on-surface">
            Update status
          </span>
          <select
            name="status"
            defaultValue={order.status}
            className="bg-surface-container-low border border-outline-variant rounded-md px-4 py-2 text-body-md outline-none focus:border-secondary"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="bg-primary text-on-primary px-stack-md py-stack-sm rounded-lg font-label-md text-label-md hover:opacity-90"
        >
          Save
        </button>
      </form>

      {/* Items */}
      <div className="glass-card rounded-xl p-stack-md flex flex-col gap-stack-sm">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-stack-sm font-body-md text-body-md"
          >
            <span className="text-on-surface">
              {item.name}
              {item.variant_label ? ` — ${item.variant_label}` : ""}{" "}
              <span className="text-on-surface-variant">× {item.qty}</span>
            </span>
            <span className="text-on-surface whitespace-nowrap">
              {formatINR(item.unit_price * item.qty)}
            </span>
          </div>
        ))}
        <div className="border-t border-outline-variant/20 pt-stack-sm flex flex-col gap-stack-xs">
          <Row label="Subtotal" value={formatINR(order.subtotal)} />
          <Row
            label="Shipping"
            value={
              order.shipping_fee === 0 ? "Free" : formatINR(order.shipping_fee)
            }
          />
          <div className="flex justify-between font-label-md text-label-md text-on-surface pt-stack-xs">
            <span>Total</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="glass-card rounded-xl p-stack-md">
        <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-stack-xs">
          Shipping to
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {addr.fullName}
          <br />
          {addr.line1}
          {addr.line2 ? `, ${addr.line2}` : ""}
          <br />
          {addr.city}, {addr.state} {addr.pincode}
          <br />
          {addr.phone}
        </p>
      </div>
    </div>
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
