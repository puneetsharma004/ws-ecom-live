import { PageHeader } from "@/components/store/PageHeader";

export function InfoPage({ title, subtitle, children }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto pb-stack-xl flex flex-col gap-stack-sm font-body-md text-body-md text-on-surface-variant">
        {children}
      </div>
    </div>
  );
}
