"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/lib/cart/cart-context";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/money";

export function ProductPurchase({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const variants = product.variants ?? [];

  const [variantId, setVariantId] = useState(variants[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = variant?.price ?? product.basePrice;
  const stock = variant?.stock ?? 0;
  const inStock = stock > 0;
  const onSale = product.compareAtPrice && product.compareAtPrice > price;

  function buildItem() {
    return {
      key: variant.id,
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      variantLabel: variant.label,
      price: variant.price,
      image: product.image,
      stock: variant.stock,
    };
  }

  function handleAdd() {
    if (!inStock) return;
    addItem(buildItem(), qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!inStock) return;
    addItem(buildItem(), qty);
    router.push("/cart");
  }

  return (
    <div>
      <div className="flex items-baseline gap-stack-sm mb-stack-md">
        <span className="font-headline-xl text-headline-xl text-secondary">
          {formatINR(price)}
        </span>
        {onSale && (
          <span className="font-body-lg text-body-lg text-on-surface-variant line-through">
            {formatINR(product.compareAtPrice)}
          </span>
        )}
      </div>

      {variants.length > 0 && (
        <div className="mb-stack-md">
          <h3 className="font-label-md text-label-md text-on-surface mb-stack-xs uppercase tracking-wider">
            Option
          </h3>
          <div className="flex flex-wrap gap-3">
            {variants.map((v) => {
              const disabled = v.stock <= 0;
              return (
                <button
                  type="button"
                  key={v.id}
                  disabled={disabled}
                  onClick={() => setVariantId(v.id)}
                  className={cn(
                    "py-3 px-4 border rounded-lg font-label-md text-label-md transition-colors",
                    v.id === variant?.id
                      ? "border-primary bg-surface-container-lowest text-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-outline",
                    disabled && "opacity-40 line-through cursor-not-allowed",
                  )}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="glass-panel p-stack-md rounded-xl ambient-shadow border border-surface-container-highest">
        <div className="flex items-center justify-between mb-stack-md">
          <span className="font-label-md text-label-md text-on-surface">
            {inStock ? (
              <span className="text-[#10B981]">
                In stock{stock <= 10 ? ` — only ${stock} left` : ""}
              </span>
            ) : (
              <span className="text-error">Out of stock</span>
            )}
          </span>
          <div className="flex items-center border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-4 py-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <Icon name="remove" className="text-[20px]" />
            </button>
            <span className="px-4 py-2 font-label-md text-label-md text-primary w-12 text-center">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(stock || 1, q + 1))}
              className="px-4 py-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
            >
              <Icon name="add" className="text-[20px]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            onClick={handleBuyNow}
            disabled={!inStock}
            className="w-full py-4 rounded-lg"
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            onClick={handleAdd}
            disabled={!inStock}
            className="w-full py-4 rounded-lg"
          >
            <Icon name={added ? "check" : "shopping_cart"} />
            {added ? "Added to cart" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
