import { InfoPage } from "@/components/store/InfoPage";

export const metadata = { title: "Shipping Info" };

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping information">
      {/* TODO: finalize shipping rates and timelines. */}
      <p>
        We ship across India. Orders are typically processed within 1–2 business
        days, with delivery timelines depending on your location.
      </p>
      <p>Shipping charges, if any, are shown at checkout before payment.</p>
    </InfoPage>
  );
}
