import { Badge } from "@/components/ui/Badge";

const VARIANTS = {
  pending: "warning",
  paid: "success",
  processing: "warning",
  shipped: "success",
  delivered: "success",
  cancelled: "error",
};

const LABELS = {
  pending: "Payment pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }) {
  return (
    <Badge variant={VARIANTS[status] ?? "neutral"}>
      {LABELS[status] ?? status}
    </Badge>
  );
}
