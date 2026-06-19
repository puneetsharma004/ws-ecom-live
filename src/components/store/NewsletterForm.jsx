"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setMessage(data.message || "You're on the list!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  if (status === "success") {
    return (
      <p className="font-body-md text-body-md text-secondary">{message}</p>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row gap-stack-sm"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-grow bg-surface-container-low border border-outline-variant/30 rounded-lg px-stack-md py-stack-sm font-body-md text-body-md text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cubic-transition"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
      {status === "error" && (
        <p className="mt-stack-sm font-body-md text-label-md text-error">
          {message}
        </p>
      )}
    </div>
  );
}
