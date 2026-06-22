"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { updateProfile } from "@/lib/auth/actions";

const inputCls =
  "bg-surface-container-low border border-outline-variant/40 rounded-lg px-stack-sm py-stack-sm font-body-md text-body-md text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cubic-transition";

export function EditProfileForm({ fullName = "", phone = "" }) {
  const [state, formAction, pending] = useActionState(updateProfile, {});

  return (
    <form
      action={formAction}
      className="glass-card rounded-xl p-stack-md max-w-lg flex flex-col gap-stack-sm"
    >
      <h2 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">
        Edit profile
      </h2>
      <label className="flex flex-col gap-stack-xs">
        <span className="font-label-md text-label-md text-on-surface">
          Full name
        </span>
        <input
          name="full_name"
          defaultValue={fullName}
          autoComplete="name"
          className={inputCls}
        />
      </label>
      <label className="flex flex-col gap-stack-xs">
        <span className="font-label-md text-label-md text-on-surface">
          Phone
        </span>
        <input
          name="phone"
          defaultValue={phone}
          autoComplete="tel"
          inputMode="tel"
          className={inputCls}
        />
      </label>

      {state?.error && (
        <p className="font-label-md text-label-md text-error">{state.error}</p>
      )}
      {state?.message && (
        <p className="font-label-md text-label-md text-[#10B981]">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="rounded-lg self-start"
      >
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
