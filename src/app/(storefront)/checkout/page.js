import { PageHeader } from "@/components/store/PageHeader";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div>
      <PageHeader
        title="Checkout"
        subtitle="Secure Razorpay checkout is coming in the next phase."
      />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Address entry, server-side re-pricing, and Razorpay payment will live
          here. Your cart contents are saved in the meantime.
        </p>
      </div>
    </div>
  );
}
