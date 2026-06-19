import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { buildShopQuery } from "@/lib/shopParams";

// Returns a compact page list like [1, "…", 4, 5, 6, "…", 12].
function pageRange(page, total) {
  const pages = new Set([1, total, page, page - 1, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({ current, page, totalPages }) {
  if (totalPages <= 1) return null;

  const arrow =
    "w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center transition-colors text-on-surface-variant";

  return (
    <div className="mt-stack-xl flex justify-center items-center gap-2">
      {page > 1 ? (
        <Link
          href={buildShopQuery(current, { page: page - 1 })}
          aria-label="Previous page"
          className={cn(arrow, "hover:bg-surface-container-high")}
        >
          <Icon name="chevron_left" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-40")} aria-hidden="true">
          <Icon name="chevron_left" />
        </span>
      )}

      {pageRange(page, totalPages).map((p, i) =>
        p === "…" ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static ellipsis separator
          <span key={`gap-${i}`} className="text-on-surface-variant px-2">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildShopQuery(current, { page: p })}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-label-md text-label-md transition-colors",
              p === page
                ? "bg-primary text-on-primary"
                : "border border-outline-variant text-on-surface hover:bg-surface-container-high",
            )}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={buildShopQuery(current, { page: page + 1 })}
          aria-label="Next page"
          className={cn(arrow, "hover:bg-surface-container-high")}
        >
          <Icon name="chevron_right" />
        </Link>
      ) : (
        <span className={cn(arrow, "opacity-40")} aria-hidden="true">
          <Icon name="chevron_right" />
        </span>
      )}
    </div>
  );
}
