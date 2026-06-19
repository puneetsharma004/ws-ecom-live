import { cn } from "@/lib/cn";

export function GlassCard({ className, children, ...props }) {
  return (
    <div className={cn("glass-card rounded-xl", className)} {...props}>
      {children}
    </div>
  );
}
