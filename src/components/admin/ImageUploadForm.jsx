"use client";

import { useActionState, useEffect, useRef } from "react";
import { uploadImage } from "@/lib/admin/actions";

const cls =
  "bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-body-md outline-none focus:border-secondary";

export function ImageUploadForm({ productId, nextSortOrder = 0 }) {
  const formRef = useRef(null);
  const [state, formAction, pending] = useActionState(uploadImage, {});

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
      <input type="hidden" name="sort_order" value={nextSortOrder} />
      <p className="font-label-md text-label-md text-on-surface">
        Upload an image
      </p>
      <input
        type="file"
        name="file"
        accept="image/*"
        required
        className="font-body-md text-body-md text-on-surface-variant"
      />
      <input name="alt" placeholder="Alt text (optional)" className={cls} />
      {state?.error && (
        <p className="font-label-sm text-label-sm text-error">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start bg-secondary text-on-secondary px-stack-md py-2 rounded-lg font-label-sm text-label-sm hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
