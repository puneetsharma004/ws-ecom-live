import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const columns = [
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/shipping", label: "Shipping Info" },
      { href: "/returns", label: "Returns" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full py-stack-xl bg-surface-container-highest mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col">
          <div className="font-headline-lg text-headline-lg font-black text-primary mb-stack-md">
            WS CubeTech
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-auto">
            © {new Date().getFullYear()} WS CubeTech Store. Engineered for
            Precision.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-stack-sm">
            <h4 className="font-label-md text-label-md text-primary mb-stack-xs">
              {col.title}
            </h4>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-stack-sm">
          <h4 className="font-label-md text-label-md text-primary mb-stack-xs">
            Connect
          </h4>
          <Link
            href="/contact"
            className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2"
          >
            <Icon name="mail" className="text-[18px]" /> Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
