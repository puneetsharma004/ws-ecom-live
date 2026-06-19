import { PageHeader } from "@/components/store/PageHeader";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="Your orders"
        subtitle="Order history is coming with checkout."
      />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Once checkout is live, your past orders will appear here.
        </p>
      </div>
    </div>
  );
}
