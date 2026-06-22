import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-stack-md px-margin-mobile text-center">
      <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">
        404
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        We couldn't find that page.
      </p>
      <Link href="/" className={buttonClasses({ className: "rounded-full" })}>
        Back to home
      </Link>
    </div>
  );
}
