// Tiny className joiner (filters out falsy values). Avoids a clsx dependency.
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
