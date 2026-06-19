import Link from "next/link";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import { getAdminOrders } from "@/lib/db/admin";
import { formatINR } from "@/lib/money";

export const metadata = { title: "Orders" };

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="flex flex-col gap-stack-md">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">
        Orders
      </h1>

      <div className="glass-card rounded-xl p-stack-md overflow-x-auto">
        {orders.length === 0
          ? <p className="font-body-md text-body-md text-on-surface-variant">
              No orders yet.
            </p>
          : <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-label-sm text-on-surface-variant">
                  <th className="pb-3 font-medium pr-4">Order</th>
                  <th className="pb-3 font-medium pr-4">Customer</th>
                  <th className="pb-3 font-medium pr-4">Date</th>
                  <th className="pb-3 font-medium pr-4">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-body-md text-on-surface">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low/50"
                  >
                    <td className="py-3 pr-4 font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:text-secondary"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-on-surface-variant">
                      {order.email}
                    </td>
                    <td className="py-3 pr-4 text-on-surface-variant text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3 pr-4 font-medium">
                      {formatINR(order.total)}
                    </td>
                    <td className="py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
      </div>
    </div>
  );
}
