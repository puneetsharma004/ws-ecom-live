import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductPurchase } from "@/components/store/ProductPurchase";
import { Icon } from "@/components/ui/Icon";
import { getProductBySlug, getRelatedProducts } from "@/lib/db/catalog";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(
    product.category?.slug,
    product.slug,
    4,
  );

  const primaryImage = product.images[0] ?? null;
  const purchaseProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    basePrice: product.basePrice,
    compareAtPrice: product.compareAtPrice,
    variants: product.variants,
    image: primaryImage
      ? { url: primaryImage.url, alt: primaryImage.alt }
      : null,
  };

  return (
    <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
      {/* Breadcrumbs */}
      <div className="mb-stack-md flex items-center flex-wrap gap-x-2 gap-y-1 font-label-sm text-label-sm text-outline">
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <Icon name="chevron_right" className="text-[16px]" />
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <Icon name="chevron_right" className="text-[16px]" />
        <span className="text-on-surface">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-margin-desktop items-start">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="lg:col-span-5 flex flex-col pt-stack-md lg:pt-0">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary mb-stack-md tracking-tight">
            {product.name}
          </h1>

          <ProductPurchase product={purchaseProduct} />

          {product.description && (
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-lg border-t border-outline-variant/20 pt-stack-md">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-stack-xl pt-stack-xl border-t border-outline-variant/20">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-stack-md text-center">
            Complete Your Setup
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
