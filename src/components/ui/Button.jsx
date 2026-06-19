import { cn } from "@/lib/cn.js";

const base =
  "inline-flex items-center justify-center gap-2 font-label-md text-label-md cubic-transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-primary text-on-primary hover:opacity-90",
  secondary: "bg-secondary text-on-secondary hover:opacity-90",
  outline:
    "border border-outline-variant text-primary hover:bg-surface-container-highest",
  ghost:
    "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50",
  glass: "glass-panel text-primary hover:bg-surface-container-high/50",
};

const sizes = {
  sm: "px-4 py-2 rounded-lg",
  md: "px-stack-md py-stack-sm rounded-lg",
  lg: "px-stack-lg py-4 rounded-lg",
};

// Shared class builder so links (next/link) can look like buttons too.
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
