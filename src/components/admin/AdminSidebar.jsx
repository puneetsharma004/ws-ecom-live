"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { signout } from "@/lib/auth/actions";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Dashboard", icon: "analytics" },
  { href: "/admin/inventory", label: "Inventory", icon: "inventory_2" },
  { href: "/admin/orders", label: "Orders", icon: "shopping_bag" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

function isActive(pathname, href) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminSidebar({ adminName }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest shadow-sm z-40 flex-col p-stack-md border-r border-outline-variant/20">
        <div className="mb-stack-lg">
          <Link
            href="/admin"
            className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight"
          >
            WS CubeTech
          </Link>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-stack-xs">
            System Manager
          </p>
        </div>

        <div className="flex items-center gap-unit mb-stack-lg p-unit bg-surface-container-low rounded-lg">
          <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-md">
            {(adminName?.[0] ?? "A").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-label-md text-label-md text-on-surface truncate">
              {adminName}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Portal Access
            </p>
          </div>
        </div>

        <Link
          href="/admin/inventory/new"
          className="w-full mb-stack-lg bg-primary text-on-primary py-stack-sm rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-unit"
        >
          <Icon name="add" className="text-[20px]" />
          New Product
        </Link>

        <div className="flex-1 flex flex-col gap-unit">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-stack-sm px-stack-sm py-stack-sm rounded-lg font-label-md text-label-md transition-all",
                isActive(pathname, link.href)
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary",
              )}
            >
              <Icon name={link.icon} fill={isActive(pathname, link.href)} />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto border-t border-outline-variant/20 pt-stack-md flex flex-col gap-unit">
          <Link
            href="/"
            className="flex items-center gap-stack-sm px-stack-sm py-stack-sm text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-lg font-label-md text-label-md transition-all"
          >
            <Icon name="storefront" />
            View store
          </Link>
          <form action={signout}>
            <button
              type="submit"
              className="w-full flex items-center gap-stack-sm px-stack-sm py-stack-sm text-on-surface-variant hover:bg-surface-container-high hover:text-primary rounded-lg font-label-md text-label-md transition-all"
            >
              <Icon name="logout" />
              Logout
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav className="md:hidden fixed top-0 left-0 w-full z-40 bg-surface-container-lowest border-b border-outline-variant/20 flex items-center gap-1 px-margin-mobile py-stack-sm overflow-x-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-2 rounded-lg font-label-sm text-label-sm whitespace-nowrap",
              isActive(pathname, link.href)
                ? "bg-secondary-container text-on-secondary-container font-bold"
                : "text-on-surface-variant",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
