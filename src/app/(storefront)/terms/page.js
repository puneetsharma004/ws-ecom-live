import { InfoPage } from "@/components/store/InfoPage";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Service">
      {/* TODO: finalize with legal before launch. */}
      <p>
        By using WS CubeTech Store you agree to these terms. This is a
        placeholder to be replaced with final terms covering orders, pricing,
        and acceptable use.
      </p>
    </InfoPage>
  );
}
