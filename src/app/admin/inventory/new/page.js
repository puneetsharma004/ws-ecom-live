import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/db/catalog";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-stack-md max-w-3xl">
      <Link
        href="/admin/inventory"
        className="font-label-sm text-label-sm text-secondary hover:underline"
      >
        ← Inventory
      </Link>
      <h1 className="font-headline-lg text-headline-lg text-on-surface">
        New product
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant -mt-stack-sm">
        Create the product, then add variants (stock) and images on the next
        screen.
      </p>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
