import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Settings" };

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-stack-md py-stack-xs border-b border-outline-variant/10 last:border-0">
      <span className="font-label-md text-label-md text-on-surface-variant">
        {label}
      </span>
      <span className="font-body-md text-body-md text-on-surface text-right break-all">
        {value}
      </span>
    </div>
  );
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-stack-md max-w-2xl">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">
        Settings
      </h1>

      <div className="glass-card rounded-xl p-stack-md">
        <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-stack-sm">
          Signed in as
        </h2>
        <Row label="Email" value={user?.email} />
        <Row label="Role" value="admin" />
      </div>

      <div className="glass-card rounded-xl p-stack-md">
        <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-stack-sm">
          Store
        </h2>
        <Row label="Site URL" value={process.env.NEXT_PUBLIC_SITE_URL || "—"} />
        <Row
          label="Courses link"
          value={process.env.NEXT_PUBLIC_COURSES_URL || "—"}
        />
        <Row
          label="Payments"
          value={
            process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
              ? "Razorpay connected"
              : "Not configured"
          }
        />
      </div>

      <p className="font-body-md text-body-md text-on-surface-variant">
        To grant another person admin access, set{" "}
        <code className="bg-surface-container-high px-1 rounded">
          profiles.role = 'admin'
        </code>{" "}
        for their user in the Supabase dashboard.
      </p>
    </div>
  );
}
