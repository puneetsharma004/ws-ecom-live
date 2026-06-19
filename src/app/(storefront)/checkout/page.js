import { redirect } from "next/navigation";
import { CheckoutClient } from "@/components/store/CheckoutClient";
import { PageHeader } from "@/components/store/PageHeader";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div>
        <PageHeader title="Checkout" />
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Checkout will be available once Supabase is connected.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/checkout");

  const configured = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  return (
    <div>
      <PageHeader title="Checkout" />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
        <CheckoutClient email={user.email} configured={configured} />
      </div>
    </div>
  );
}
