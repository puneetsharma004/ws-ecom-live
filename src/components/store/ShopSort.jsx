"use client";

import { useRouter } from "next/navigation";
import { buildShopQuery } from "@/lib/shopParams";

const options = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function ShopSort({ current }) {
  const router = useRouter();

  return (
    <div className="flex items-center space-x-4">
      <label
        className="font-label-md text-label-md text-on-surface"
        htmlFor="sort"
      >
        Sort by:
      </label>
      <select
        id="sort"
        value={current.sort}
        onChange={(e) =>
          router.push(
            buildShopQuery(current, { sort: e.target.value, page: 1 }),
          )
        }
        className="bg-surface-container-low border border-outline-variant rounded-md px-4 py-2 text-body-md focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
