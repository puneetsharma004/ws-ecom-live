"use client";

// Submit button that asks for confirmation before allowing the form to submit.
export function ConfirmSubmit({
  message = "Are you sure?",
  className,
  children,
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
