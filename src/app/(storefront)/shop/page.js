import { PageHeader } from "@/components/store/PageHeader";

export const metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <div>
      <PageHeader
        title="Shop"
        subtitle="The full catalog is coming in the next build phase."
      />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Product listing, filters, and search will appear here.
        </p>
      </div>
    </div>
  );
}
