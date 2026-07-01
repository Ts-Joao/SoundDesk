interface StatCardProps {
  label: string;
  value: number | string;
  emoji: string;
  color: string;
  small?: boolean;
  trend?: string;
}

export function StatCard({ label, value, emoji, color, small, trend }: StatCardProps) {
  return (
    <div
      style={{
        background: "#1A1B2E",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: small ? "12px 14px" : "16px 18px",
        display: "flex",
        alignItems: small ? "center" : "flex-start",
        gap: 14,
      }}
    >
      <div
        style={{
          width: small ? 34 : 44,
          height: small ? 34 : 44,
          borderRadius: small ? 8 : 12,
          background: `${color}18`,
          border: `1px solid ${color}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: small ? 16 : 20,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: small ? 22 : 28,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginTop: 3,
          }}
        >
          {value}
        </div>
        {trend && (
          <div style={{ fontSize: 11, color: "rgba(34,197,94,0.9)", marginTop: 3 }}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}
