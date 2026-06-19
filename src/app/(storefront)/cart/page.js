import { CartView } from "@/components/store/CartView";
import { PageHeader } from "@/components/store/PageHeader";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div>
      <PageHeader title="Your cart" />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
        <CartView />
      </div>
    </div>
  );
}
