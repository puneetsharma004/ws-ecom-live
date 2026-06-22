import Link from "next/link";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/store/EditProfileForm";
import { PageHeader } from "@/components/store/PageHeader";
import { Button } from "@/components/ui/Button";
import { signout } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div>
        <PageHeader title="My account" />
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Accounts will be available once Supabase is connected.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .single();

  return (
    <div>
      <PageHeader
        title={`Hi, ${profile?.full_name || user.email}`}
        subtitle="Manage your account and orders."
      />
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-stack-xl flex flex-col gap-stack-md">
        <div className="glass-card rounded-xl p-stack-md max-w-lg flex flex-col gap-stack-sm">
          <Row label="Email" value={user.email} />
          {profile?.full_name && <Row label="Name" value={profile.full_name} />}
          {profile?.phone && <Row label="Phone" value={profile.phone} />}
          <Row label="Account type" value={profile?.role ?? "customer"} />

          <div className="flex items-center gap-stack-sm mt-stack-sm">
            <Link
              href="/orders"
              className="font-label-md text-label-md text-secondary hover:underline"
            >
              View orders
            </Link>
            {profile?.role === "admin" && (
              <Link
                href="/admin"
                className="font-label-md text-label-md text-secondary hover:underline"
              >
                Admin panel
              </Link>
            )}
          </div>

          <form action={signout} className="mt-stack-sm">
            <Button type="submit" variant="outline" className="rounded-lg">
              Sign out
            </Button>
          </form>
        </div>

        <EditProfileForm
          fullName={profile?.full_name ?? ""}
          phone={profile?.phone ?? ""}
        />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-stack-md">
      <span className="font-label-md text-label-md text-on-surface-variant">
        {label}
      </span>
      <span className="font-body-md text-body-md text-on-surface">{value}</span>
    </div>
  );
}
