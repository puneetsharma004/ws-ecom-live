import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { getAdminProducts } from "@/lib/db/admin";
import { formatINR } from "@/lib/money";

export const metadata = { title: "Inventory" };

const statusVariant = {
  active: "success",
  draft: "neutral",
  archived: "warning",
};

export default async function InventoryPage() {
  const products = await getAdminProducts();

  return (
    <div className="flex flex-col gap-stack-md">
      <div className="flex items-center justify-between gap-stack-sm">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Inventory
        </h1>
        <Link
          href="/admin/inventory/new"
          className="bg-primary text-on-primary px-stack-md py-stack-sm rounded-lg font-label-md text-label-md hover:opacity-90 flex items-center gap-unit"
        >
          <Icon name="add" className="text-[20px]" />
          New product
        </Link>
      </div>

      <div className="glass-card rounded-xl p-stack-md overflow-x-auto">
        {products.length === 0
          ? <p className="font-body-md text-body-md text-on-surface-variant">
              No products yet. Create your first one.
            </p>
          : <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-label-sm text-on-surface-variant">
                  <th className="pb-3 font-medium pr-4">Product</th>
                  <th className="pb-3 font-medium pr-4">Category</th>
                  <th className="pb-3 font-medium pr-4">Price</th>
                  <th className="pb-3 font-medium pr-4">Stock</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-body-md text-on-surface">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low/50"
                  >
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/inventory/${p.id}`}
                        className="flex items-center gap-stack-sm"
                      >
                        <span className="w-10 h-10 rounded-md bg-surface-container-high overflow-hidden flex items-center justify-center shrink-0">
                          {p.image
                            ? // biome-ignore lint/performance/noImgElement: remote catalog image
                              <img
                                src={p.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            : <Icon name="image" className="text-outline" />}
                        </span>
                        <span className="font-medium hover:text-secondary">
                          {p.name}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-on-surface-variant">
                      {p.category}
                    </td>
                    <td className="py-3 pr-4 font-medium">
                      {formatINR(p.basePrice)}
                    </td>
                    <td className="py-3 pr-4">{p.stock}</td>
                    <td className="py-3">
                      <Badge variant={statusVariant[p.status] ?? "neutral"}>
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
      </div>
    </div>
  );
}
