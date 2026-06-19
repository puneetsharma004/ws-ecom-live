import { Icon } from "@/components/ui/Icon";

export function StatCard({ label, value, icon }) {
  return (
    <div className="glass-card rounded-xl p-stack-md flex flex-col gap-unit">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-label-md text-label-md text-on-surface-variant">
            {label}
          </p>
          <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">
            {value}
          </h3>
        </div>
        <div className="p-2 bg-surface-container-high rounded-lg text-primary">
          <Icon name={icon} />
        </div>
      </div>
    </div>
  );
}
