import { Footer } from "@/components/store/Footer";
import { TopNav } from "@/components/store/TopNav";

export default function StorefrontLayout({ children }) {
  return (
    <>
      <TopNav />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </>
  );
}
