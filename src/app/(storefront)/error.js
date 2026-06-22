"use client";

export default function StorefrontError({ reset }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-stack-md px-margin-mobile text-center">
      <h2 className="font-headline-lg text-headline-lg text-primary">
        Something went wrong
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant">
        Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-primary text-on-primary px-stack-md py-stack-sm rounded-full font-label-md text-label-md hover:opacity-90"
      >
        Retry
      </button>
    </div>
  );
}
