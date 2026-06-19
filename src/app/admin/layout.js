import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: { default: "Admin", template: "%s · Admin" },
};

// Defense in depth: the proxy already guards /admin, but the layout re-checks
// the role on the server so the panel can never render for a non-admin.
export default async function AdminLayout({ children }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar adminName={profile.full_name || user.email} />
      <main className="flex-1 md:ml-64 min-h-screen overflow-y-auto p-margin-mobile md:p-margin-desktop pt-20 md:pt-margin-desktop">
        {children}
      </main>
    </div>
  );
}
