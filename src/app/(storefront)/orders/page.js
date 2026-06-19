import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import { PageHeader } from "@/components/store/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { getOrders } from "@/lib/db/orders";
import { formatINR } from "@/lib/money";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Orders" };

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function OrdersPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div>
        <PageHeader title="Your orders" />
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Orders will be available once Supabase is connected.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/orders");

  const orders = await getOrders();

  return (
    <div>
      <PageHeader title="Your orders" />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
        {orders.length === 0
          ? <div className="text-center py-stack-xl">
              <Icon name="receipt_long" className="text-[48px] text-outline" />
              <p className="font-body-md text-body-md text-on-surface-variant mt-stack-sm">
                You haven't placed any orders yet.
              </p>
            </div>
          : <div className="flex flex-col gap-stack-sm">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between gap-stack-sm p-stack-md bg-surface-container-lowest rounded-xl border border-outline-variant/20 hover:border-outline-variant transition-colors"
                >
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">
                      {order.order_number}
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-stack-md">
                    <span className="font-label-md text-label-md text-on-surface">
                      {formatINR(order.total)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <Icon name="chevron_right" className="text-outline" />
                  </div>
                </Link>
              ))}
            </div>}
      </div>
    </div>
  );
}
