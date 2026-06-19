import { Pagination } from "@/components/store/Pagination";
import { ProductCard } from "@/components/store/ProductCard";
import { ShopSidebar } from "@/components/store/ShopSidebar";
import { ShopSort } from "@/components/store/ShopSort";
import { getCategories, getProducts } from "@/lib/db/catalog";
import { parseShopParams } from "@/lib/shopParams";

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const current = parseShopParams(sp);

  const [{ products, total, page, perPage, totalPages }, categories] =
    await Promise.all([getProducts(current), getCategories()]);

  const firstItem = total === 0 ? 0 : (page - 1) * perPage + 1;
  const lastItem = Math.min(page * perPage, total);

  return (
    <main className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col md:flex-row gap-gutter">
      <ShopSidebar categories={categories} current={current} />

      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-stack-md gap-4">
          <div className="text-on-surface-variant font-body-md text-body-md">
            {total === 0
              ? "No products found"
              : `Showing ${firstItem}-${lastItem} of ${total} product${total === 1 ? "" : "s"}`}
          </div>
          <ShopSort current={current} />
        </div>

        {products.length === 0
          ? <div className="border border-outline-variant/30 rounded-xl py-stack-xl text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Nothing matches these filters yet. Try clearing them.
              </p>
            </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>}

        <Pagination current={current} page={page} totalPages={totalPages} />
      </div>
    </main>
  );
}
