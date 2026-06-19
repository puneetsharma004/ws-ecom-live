"use client";

import { useActionState } from "react";
import { createProduct, updateProduct } from "@/lib/admin/actions";

function Field({ label, children }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the form control is passed in as children
    <label className="flex flex-col gap-stack-xs">
      <span className="font-label-md text-label-md text-on-surface">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "bg-surface-container-low border border-outline-variant/50 rounded-lg px-stack-sm py-stack-sm font-body-md text-body-md text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none";

export function ProductForm({ mode = "create", categories, product }) {
  const action = mode === "edit" ? updateProduct : createProduct;
  const [state, formAction, pending] = useActionState(action, {});

  const rupees = (paise) => (paise != null ? paise / 100 : "");

  return (
    <form
      action={formAction}
      className="glass-card rounded-xl p-stack-md flex flex-col gap-stack-sm"
    >
      {mode === "edit" && <input type="hidden" name="id" value={product.id} />}

      <div className="grid sm:grid-cols-2 gap-stack-sm">
        <Field label="Name">
          <input
            name="name"
            defaultValue={product?.name ?? ""}
            required
            className={inputCls}
          />
        </Field>
        <Field label="Slug (optional — auto from name)">
          <input
            name="slug"
            defaultValue={product?.slug ?? ""}
            className={inputCls}
            placeholder="ws-core-tee"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={3}
          className={inputCls}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-stack-sm">
        <Field label="Category">
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            required
            className={inputCls}
          >
            <option value="" disabled>
              Select…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            name="status"
            defaultValue={product?.status ?? "draft"}
            className={inputCls}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-stack-sm">
        <Field label="Base price (₹)">
          <input
            name="base_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={rupees(product?.base_price)}
            required
            className={inputCls}
          />
        </Field>
        <Field label="Compare-at price (₹, optional)">
          <input
            name="compare_at_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={rupees(product?.compare_at_price)}
            className={inputCls}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="is_featured"
          defaultChecked={product?.is_featured ?? false}
          className="rounded border-outline-variant text-secondary focus:ring-secondary/50"
        />
        <span className="font-body-md text-body-md text-on-surface">
          Feature on the home page
        </span>
      </label>

      {state?.error && (
        <p className="font-label-md text-label-md text-error">{state.error}</p>
      )}
      {state?.message && (
        <p className="font-label-md text-label-md text-[#10B981]">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-primary text-on-primary px-stack-md py-stack-sm rounded-lg font-label-md text-label-md hover:opacity-90 disabled:opacity-50"
      >
        {pending
          ? "Saving…"
          : mode === "edit"
            ? "Save changes"
            : "Create product"}
      </button>
    </form>
  );
}
