import { InfoPage } from "@/components/store/InfoPage";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <InfoPage title="Contact us" subtitle="We'd love to hear from you.">
      <p>
        For questions about orders, products, or anything else, email us and our
        team will get back to you.
      </p>
      {/* TODO: replace with the official store support email. */}
      <p className="text-on-surface">
        Email:{" "}
        <a
          className="text-secondary hover:underline"
          href="mailto:support@wscubetech.com"
        >
          support@wscubetech.com
        </a>
      </p>
    </InfoPage>
  );
}
