import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { ImageUploadForm } from "@/components/admin/ImageUploadForm";
import { ProductForm } from "@/components/admin/ProductForm";
import { VariantAddForm } from "@/components/admin/VariantAddForm";
import { Icon } from "@/components/ui/Icon";
import {
  deleteImage,
  deleteProduct,
  deleteVariant,
  updateVariant,
} from "@/lib/admin/actions";
import { getAdminProductById } from "@/lib/db/admin";
import { getCategories } from "@/lib/db/catalog";

export const metadata = { title: "Edit product" };

const cls =
  "bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-md outline-none focus:border-secondary";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getCategories(),
  ]);
  if (!product) notFound();

  const variants = product.product_variants ?? [];
  const images = product.product_images ?? [];
  const nextSort = (images.at(-1)?.sort_order ?? -1) + 1;

  return (
    <div className="flex flex-col gap-stack-lg max-w-3xl">
      <div className="flex items-center justify-between gap-stack-sm">
        <Link
          href="/admin/inventory"
          className="font-label-sm text-label-sm text-secondary hover:underline"
        >
          ← Inventory
        </Link>
        <Link
          href={`/products/${product.slug}`}
          className="font-label-sm text-label-sm text-secondary hover:underline"
        >
          View on store ↗
        </Link>
      </div>

      <h1 className="font-headline-lg text-headline-lg text-on-surface">
        {product.name}
      </h1>

      <ProductForm mode="edit" categories={categories} product={product} />

      {/* Variants */}
      <section className="glass-card rounded-xl p-stack-md flex flex-col gap-stack-sm">
        <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
          Variants &amp; stock
        </h2>

        {variants.length === 0
          ? <p className="font-body-md text-body-md text-on-surface-variant">
              No variants yet — add at least one so the product can be
              purchased.
            </p>
          : <div className="flex flex-col gap-stack-sm">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-wrap items-end gap-stack-sm p-stack-sm bg-surface-container-lowest rounded-lg border border-outline-variant/20"
                >
                  <form
                    action={updateVariant}
                    className="flex flex-wrap items-end gap-2"
                  >
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="product_id" value={product.id} />
                    <input
                      name="label"
                      defaultValue={v.label}
                      className={`${cls} w-40`}
                    />
                    <input
                      name="price_override"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={
                        v.price_override != null ? v.price_override / 100 : ""
                      }
                      placeholder="base ₹"
                      className={`${cls} w-28`}
                    />
                    <input
                      name="stock_qty"
                      type="number"
                      min="0"
                      defaultValue={v.stock_qty}
                      className={`${cls} w-24`}
                    />
                    <button
                      type="submit"
                      className="bg-primary text-on-primary px-3 py-2 rounded-lg font-label-sm text-label-sm hover:opacity-90"
                    >
                      Save
                    </button>
                  </form>
                  <form action={deleteVariant}>
                    <input type="hidden" name="id" value={v.id} />
                    <input type="hidden" name="product_id" value={product.id} />
                    <ConfirmSubmit
                      message={`Delete variant "${v.label}"?`}
                      className="text-label-sm text-on-surface-variant hover:text-error px-2 py-2"
                    >
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              ))}
            </div>}

        <VariantAddForm productId={product.id} />
      </section>

      {/* Images */}
      <section className="glass-card rounded-xl p-stack-md flex flex-col gap-stack-sm">
        <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
          Images
        </h2>

        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-stack-sm">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant/20"
              >
                {/* biome-ignore lint/performance/noImgElement: remote catalog image */}
                <img
                  src={img.image_url}
                  alt={img.alt ?? ""}
                  className="w-full h-full object-cover"
                />
                <form action={deleteImage} className="absolute top-1 right-1">
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="product_id" value={product.id} />
                  <ConfirmSubmit
                    message="Delete this image?"
                    className="w-7 h-7 rounded-full bg-surface/90 text-error flex items-center justify-center hover:bg-error hover:text-on-error"
                  >
                    <Icon name="delete" className="text-[16px]" />
                  </ConfirmSubmit>
                </form>
              </div>
            ))}
          </div>
        )}

        <ImageUploadForm productId={product.id} nextSortOrder={nextSort} />
      </section>

      {/* Danger zone */}
      <form action={deleteProduct} className="flex">
        <input type="hidden" name="id" value={product.id} />
        <ConfirmSubmit
          message={`Delete "${product.name}"? This also removes its variants and images.`}
          className="text-label-md text-label-md text-error border border-error/40 rounded-lg px-stack-md py-stack-sm hover:bg-error hover:text-on-error transition-colors"
        >
          Delete product
        </ConfirmSubmit>
      </form>
    </div>
  );
}
