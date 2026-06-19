import { InfoPage } from "@/components/store/InfoPage";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy">
      {/* TODO: finalize with legal before launch. */}
      <p>
        This placeholder describes how WS CubeTech Store collects and uses
        information needed to process orders, including your name, contact
        details, and shipping address.
      </p>
      <p>
        Payment information is handled securely by our payment provider; we do
        not store card details on our servers.
      </p>
    </InfoPage>
  );
}
