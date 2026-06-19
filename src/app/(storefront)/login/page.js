import { AuthForm } from "@/components/store/AuthForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  const next = typeof sp?.next === "string" ? sp.next : "/account";
  return <AuthForm mode="login" next={next} />;
}
