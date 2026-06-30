interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  className?: string;
}

export function ProgressBar({
  value,
  color = "#6C63FF",
  height = 6,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 99,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}
