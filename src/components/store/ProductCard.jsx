import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { formatINR } from "@/lib/money";

function isNew(createdAt) {
  if (!createdAt) return false;
  const days = (Date.now() - new Date(createdAt).getTime()) / 86_400_000;
  return days <= 14;
}

export function ProductCard({ product }) {
  const href = `/products/${product.slug}`;
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.basePrice;

  return (
    <div className="product-card bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col group relative">
      {isNew(product.createdAt) && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="new">New</Badge>
        </div>
      )}

      <Link
        href={href}
        className="aspect-square bg-surface-container-low relative overflow-hidden block"
      >
        {product.image ? (
          // biome-ignore lint/performance/noImgElement: remote catalog image (Storage/CDN URL)
          <img
            src={product.image.url}
            alt={product.image.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <Icon name="image" className="text-[48px]" />
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link
          href={href}
          className="font-label-md text-label-md text-primary mb-1 hover:text-secondary transition-colors"
        >
          {product.name}
        </Link>
        {product.category && (
          <p className="font-body-md text-body-md text-on-surface-variant mb-2">
            {product.category.name}
          </p>
        )}
        <div className="mt-auto flex justify-between items-center gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
              {formatINR(product.basePrice)}
            </span>
            {onSale && (
              <span className="font-body-md text-body-md text-on-surface-variant line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>
          <Link
            href={href}
            aria-label={`View ${product.name}`}
            className="bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
          >
            <Icon name="add_shopping_cart" />
          </Link>
        </div>
      </div>
    </div>
  );
}
