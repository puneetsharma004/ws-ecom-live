import { cn } from "@/lib/cn";

const variants = {
  new: "bg-cyan-100 text-cyan-900",
  success: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20",
  warning: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
  error: "bg-error/10 text-error",
  neutral: "bg-outline/10 text-outline border border-outline/20",
};

export function Badge({ variant = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
