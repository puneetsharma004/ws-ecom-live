"use client";

import { useActionState } from "react";
import { createCourse, updateCourse } from "@/lib/admin/actions";

const inputCls =
  "bg-surface-container-low border border-outline-variant/50 rounded-lg px-stack-sm py-stack-sm font-body-md text-body-md text-primary focus:border-secondary focus:ring-1 focus:ring-secondary outline-none";

export function CourseForm({ mode = "create", course }) {
  const action = mode === "edit" ? updateCourse : createCourse;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="glass-card rounded-xl p-stack-md flex flex-col gap-stack-sm"
    >
      {mode === "edit" && <input type="hidden" name="id" value={course.id} />}

      <div className="grid sm:grid-cols-2 gap-stack-sm">
        <label className="flex flex-col gap-stack-xs">
          <span className="font-label-md text-label-md text-on-surface">
            Title
          </span>
          <input
            name="title"
            defaultValue={course?.title ?? ""}
            required
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-stack-xs">
          <span className="font-label-md text-label-md text-on-surface">
            Slug (optional)
          </span>
          <input
            name="slug"
            defaultValue={course?.slug ?? ""}
            className={inputCls}
          />
        </label>
      </div>

      <label className="flex flex-col gap-stack-xs">
        <span className="font-label-md text-label-md text-on-surface">
          Blurb
        </span>
        <textarea
          name="blurb"
          defaultValue={course?.blurb ?? ""}
          rows={3}
          className={inputCls}
        />
      </label>

      <label className="flex flex-col gap-stack-xs">
        <span className="font-label-md text-label-md text-on-surface">
          External link (where "Explore" goes)
        </span>
        <input
          name="external_url"
          type="url"
          defaultValue={course?.external_url ?? "https://www.wscubetech.com"}
          required
          className={inputCls}
        />
      </label>

      <label className="flex flex-col gap-stack-xs">
        <span className="font-label-md text-label-md text-on-surface">
          Image URL (optional)
        </span>
        <input
          name="image_url"
          defaultValue={course?.image_url ?? ""}
          className={inputCls}
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-stack-sm">
        <label className="flex flex-col gap-stack-xs">
          <span className="font-label-md text-label-md text-on-surface">
            Price label (optional, e.g. ₹4,999)
          </span>
          <input
            name="price_label"
            defaultValue={course?.price_label ?? ""}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-stack-xs">
          <span className="font-label-md text-label-md text-on-surface">
            Sort order
          </span>
          <input
            name="sort_order"
            type="number"
            defaultValue={course?.sort_order ?? 0}
            className={inputCls}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={course?.is_published ?? false}
          className="rounded border-outline-variant text-secondary focus:ring-secondary/50"
        />
        <span className="font-body-md text-body-md text-on-surface">
          Published
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
            : "Create course"}
      </button>
    </form>
  );
}
