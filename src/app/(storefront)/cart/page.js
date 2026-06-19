import { PageHeader } from "@/components/store/PageHeader";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div>
      <PageHeader
        title="Your cart"
        subtitle="Cart and checkout are coming next."
      />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Items you add will show up here, then proceed to Razorpay checkout.
        </p>
      </div>
    </div>
  );
}
