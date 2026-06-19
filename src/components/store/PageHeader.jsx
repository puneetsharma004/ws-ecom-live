export function PageHeader({ title, subtitle }) {
  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-stack-lg pb-stack-md">
      <h1 className="font-headline-xl text-headline-xl text-primary">
        {title}
      </h1>
      {subtitle && (
        <p className="font-body-md text-body-md text-on-surface-variant mt-stack-xs">
          {subtitle}
        </p>
      )}
    </div>
  );
}
