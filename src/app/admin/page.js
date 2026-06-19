import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import { Badge } from "@/components/ui/Badge";
import {
  getDashboardStats,
  getLowStockVariants,
  getRecentOrders,
} from "@/lib/db/admin";
import { formatINR } from "@/lib/money";

export const metadata = { title: "Dashboard" };

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default async function AdminDashboard() {
  const [stats, recent, lowStock] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(6),
    getLowStockVariants(6),
  ]);

  return (
    <div className="flex flex-col gap-stack-lg">
      <header>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Dashboard
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-stack-xs">
          Performance metrics and recent activity.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <StatCard
          label="Revenue (paid)"
          value={formatINR(stats.revenue)}
          icon="payments"
        />
        <StatCard
          label="Total orders"
          value={stats.orders}
          icon="local_shipping"
        />
        <StatCard
          label="Active products"
          value={stats.products}
          icon="inventory_2"
        />
        <StatCard
          label="Low-stock variants"
          value={stats.lowStock}
          icon="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Recent orders */}
        <div className="lg:col-span-2 glass-card rounded-xl p-stack-md overflow-x-auto">
          <div className="flex justify-between items-center mb-stack-md">
            <h2 className="font-label-md text-label-md text-on-surface">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-secondary text-label-sm hover:underline"
            >
              View all
            </Link>
          </div>
          {recent.length === 0
            ? <p className="font-body-md text-body-md text-on-surface-variant">
                No orders yet.
              </p>
            : <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-label-sm text-on-surface-variant">
                    <th className="pb-3 font-medium pr-4">Order</th>
                    <th className="pb-3 font-medium pr-4">Date</th>
                    <th className="pb-3 font-medium pr-4">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-body-md text-on-surface">
                  {recent.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-outline-variant/10"
                    >
                      <td className="py-3 pr-4 font-medium">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="hover:text-secondary"
                        >
                          {order.order_number}
                        </Link>
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

        {/* Low stock */}
        <div className="glass-card rounded-xl p-stack-md">
          <h2 className="font-label-md text-label-md text-on-surface mb-stack-md">
            Low stock
          </h2>
          <div className="flex flex-col gap-stack-sm">
            {lowStock.length === 0
              ? <p className="font-body-md text-body-md text-on-surface-variant">
                  Everything is well stocked.
                </p>
              : lowStock.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-unit bg-surface-container-lowest rounded-lg border border-outline-variant/20"
                  >
                    <div className="min-w-0">
                      <p className="font-label-sm text-label-sm text-on-surface truncate">
                        {v.name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {v.label}
                      </p>
                    </div>
                    <Badge variant={v.stock === 0 ? "error" : "warning"}>
                      {v.stock === 0 ? "Out" : `${v.stock} left`}
                    </Badge>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
