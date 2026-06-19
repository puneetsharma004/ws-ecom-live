import { InfoPage } from "@/components/store/InfoPage";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <InfoPage
      title="About WS CubeTech Store"
      subtitle="Engineered for Precision."
    >
      <p>
        WS CubeTech Store is the official merchandise shop for WS CubeTech —
        premium, tech-forward apparel and accessories made for students and
        professionals who build.
      </p>
      <p>
        From everyday tees and hoodies to backpacks, mugs, and desk gear, every
        item is chosen with the same attention to quality we bring to our
        learning programs.
      </p>
    </InfoPage>
  );
}
