"use client";

import { useActionState, useEffect, useRef } from "react";
import { addVariant } from "@/lib/admin/actions";

const cls =
  "bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-md outline-none focus:border-secondary";

export function VariantAddForm({ productId }) {
  const formRef = useRef(null);
  const [state, formAction, pending] = useActionState(addVariant, {});

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-stack-sm border-t border-outline-variant/20 pt-stack-sm"
    >
      <input type="hidden" name="product_id" value={productId} />
      <p className="font-label-md text-label-md text-on-surface">
        Add a variant
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-stack-sm">
        <input
          name="label"
          placeholder="Label (e.g. Black / M)"
          required
          className={`${cls} col-span-2`}
        />
        <input name="sku" placeholder="SKU" className={cls} />
        <input
          name="price_override"
          type="number"
          step="0.01"
          min="0"
          placeholder="₹ override"
          className={cls}
        />
        <input
          name="stock_qty"
          type="number"
          min="0"
          placeholder="Stock"
          defaultValue="0"
          className={cls}
        />
      </div>
      {state?.error && (
        <p className="font-label-sm text-label-sm text-error">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start bg-secondary text-on-secondary px-stack-md py-2 rounded-lg font-label-sm text-label-sm hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add variant"}
      </button>
    </form>
  );
}
