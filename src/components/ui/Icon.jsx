import { cn } from "@/lib/cn.js";

// Material Symbols icon. `fill` toggles the filled variant; size via className.
export function Icon({ name, className, fill = false, style, ...props }) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={fill ? { fontVariationSettings: "'FILL' 1", ...style } : style}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
