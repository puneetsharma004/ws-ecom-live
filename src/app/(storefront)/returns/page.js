import { InfoPage } from "@/components/store/InfoPage";

export const metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns & exchanges">
      {/* TODO: finalize return window and process. */}
      <p>
        Unused items in original packaging may be returned within the stated
        return window. To start a return, contact our support team with your
        order number.
      </p>
    </InfoPage>
  );
}
