interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-navy/10 ${className}`}>
      <div
        className="h-full rounded-full bg-navy transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
