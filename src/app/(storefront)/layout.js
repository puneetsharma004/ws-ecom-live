import { Footer } from "@/components/store/Footer";
import { TopNav } from "@/components/store/TopNav";
import { CartProvider } from "@/lib/cart/cart-context";

export default function StorefrontLayout({ children }) {
  return (
    <CartProvider>
      <TopNav />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </CartProvider>
  );
}
