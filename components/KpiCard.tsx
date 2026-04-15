interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  emphasis?: "default" | "ok" | "warn";
}

export function KpiCard({
  label,
  value,
  hint,
  emphasis = "default",
}: KpiCardProps): React.JSX.Element {
  const cardClass =
    emphasis === "default" ? "kpi-card" : `kpi-card kpi-card-${emphasis}`;

  return (
    <article className={cardClass}>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      {hint ? <p className="kpi-hint">{hint}</p> : null}
    </article>
  );
}
