"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/lib/cart/cart-context";
import { cn } from "@/lib/cn.js";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function TopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count, hydrated } = useCart();

  const isActive = (href) =>
    href === "/shop" ? pathname.startsWith("/shop") : pathname === href;

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link
          href="/"
          className="font-headline-lg text-headline-lg font-bold tracking-tight text-primary"
        >
          WS CubeTech
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-gutter">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "font-body-md text-body-md transition-colors px-unit py-stack-xs rounded",
                isActive(link.href)
                  ? "text-secondary font-semibold border-b-2 border-secondary"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-unit">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-unit text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 rounded-full transition-colors"
          >
            <Icon name="shopping_cart" />
            {hydrated && count > 0 && (
              <span className="absolute top-0 right-0 min-w-4.5 h-4.5 px-1 bg-secondary text-on-secondary rounded-full text-[11px] font-semibold flex items-center justify-center">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="p-unit text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 rounded-full transition-colors"
          >
            <Icon name="account_circle" />
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-unit text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 rounded-full transition-colors"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-outline-variant/20 bg-surface/95 backdrop-blur-xl px-margin-mobile py-stack-sm flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "py-stack-sm font-body-md text-body-md",
                isActive(link.href)
                  ? "text-secondary font-semibold"
                  : "text-on-surface-variant",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
