import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import { Icon } from "@/components/ui/Icon";
import { getOrderById } from "@/lib/db/orders";
import { formatINR } from "@/lib/money";

export const metadata = { title: "Order" };

export default async function OrderDetailPage({ params, searchParams }) {
  const { slug: id } = await params;
  const sp = (await searchParams) ?? {};
  const justPaid = sp.success === "1";

  const order = await getOrderById(id);
  if (!order) notFound();

  const addr = order.shipping_address ?? {};
  const items = order.order_items ?? [];

  return (
    <div className="max-w-3xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
      {justPaid && (
        <div className="flex items-center gap-stack-sm mb-stack-md p-stack-md rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
          <Icon
            name="check_circle"
            fill
            className="text-[#10B981] text-[28px]"
          />
          <div>
            <p className="font-label-md text-label-md text-on-surface">
              Thank you! Your order is confirmed.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              A confirmation has been recorded for {order.order_number}.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-stack-sm mb-stack-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">
            {order.order_number}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {new Date(order.created_at).toLocaleString("en-IN")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="glass-card rounded-xl p-stack-md flex flex-col gap-stack-sm mb-stack-md">
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

      <div className="glass-card rounded-xl p-stack-md mb-stack-md">
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

      <Link
        href="/orders"
        className="font-label-md text-label-md text-secondary hover:underline"
      >
        ← All orders
      </Link>
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
