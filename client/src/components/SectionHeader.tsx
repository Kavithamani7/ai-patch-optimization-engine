import { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  right,
  "data-testid": dataTestId,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  right?: ReactNode;
  "data-testid"?: string;
}) {
  return (
    <div data-testid={dataTestId} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {eyebrow ? <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">{eyebrow}</div> : null}
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
        {description ? <div className="mt-2 text-sm text-muted-foreground max-w-2xl">{description}</div> : null}
      </div>
      {right ? <div className="flex items-center gap-2 justify-start md:justify-end">{right}</div> : null}
    </div>
  );
}
