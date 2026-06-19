"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buildShopQuery } from "@/lib/shopParams";

export function ShopSidebar({ categories, current }) {
  const router = useRouter();
  const [min, setMin] = useState(current.minPrice ?? "");
  const [max, setMax] = useState(current.maxPrice ?? "");

  const selected = new Set(current.categories);

  function toggleCategory(slug) {
    const next = new Set(selected);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    router.push(buildShopQuery(current, { categories: [...next], page: 1 }));
  }

  function applyPrice(e) {
    e.preventDefault();
    router.push(
      buildShopQuery(current, { minPrice: min, maxPrice: max, page: 1 }),
    );
  }

  const hasFilters =
    selected.size > 0 || current.minPrice != null || current.maxPrice != null;

  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-stack-md">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Filters
        </h3>
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push("/shop")}
            className="font-label-sm text-label-sm text-secondary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-stack-md border-b border-outline-variant/30 pb-stack-md">
        <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
          Categories
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selected.has(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="rounded border-outline-variant text-secondary focus:ring-secondary/50 bg-surface"
              />
              <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <form
        onSubmit={applyPrice}
        className="space-y-stack-sm border-b border-outline-variant/30 pb-stack-md"
      >
        <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
          Price range (₹)
        </h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3 py-2 text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
          />
          <span className="text-on-surface-variant">-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-md px-3 py-2 text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          className="w-full font-label-sm text-label-sm text-secondary border border-outline-variant rounded-md py-2 hover:bg-surface-container-high transition-colors"
        >
          Apply
        </button>
      </form>
    </aside>
  );
}
