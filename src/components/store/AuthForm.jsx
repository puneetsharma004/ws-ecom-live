"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { login, signup } from "@/lib/auth/actions";

function Field({ label, name, ...props }) {
  return (
    <label className="flex flex-col gap-stack-xs">
      <span className="font-label-md text-label-md text-on-surface">
        {label}
      </span>
      <input
        name={name}
        className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-stack-sm py-stack-sm font-body-md text-body-md text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cubic-transition"
        {...props}
      />
    </label>
  );
}

export function AuthForm({ mode, next = "/account" }) {
  const isLogin = mode === "login";
  const [state, formAction, pending] = useActionState(
    isLogin ? login : signup,
    {},
  );

  return (
    <div className="max-w-md mx-auto w-full px-margin-mobile py-stack-xl">
      <div className="glass-card rounded-2xl p-stack-lg">
        <h1 className="font-headline-xl text-headline-xl text-primary mb-stack-xs">
          {isLogin ? "Welcome back" : "Create account"}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
          {isLogin
            ? "Sign in to your WS CubeTech account."
            : "Join the WS CubeTech network."}
        </p>

        <form action={formAction} className="flex flex-col gap-stack-sm">
          <input type="hidden" name="next" value={next} />
          {!isLogin && (
            <Field
              label="Full name"
              name="full_name"
              type="text"
              autoComplete="name"
            />
          )}
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            minLength={8}
          />

          {state?.error && (
            <p className="font-label-md text-label-md text-error">
              {state.error}
            </p>
          )}
          {state?.message && (
            <p className="font-label-md text-label-md text-secondary">
              {state.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="rounded-lg mt-stack-xs"
          >
            {pending ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-stack-md font-body-md text-body-md text-on-surface-variant text-center">
          {isLogin ? (
            <>
              No account?{" "}
              <Link className="text-secondary hover:underline" href="/signup">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link className="text-secondary hover:underline" href="/login">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
