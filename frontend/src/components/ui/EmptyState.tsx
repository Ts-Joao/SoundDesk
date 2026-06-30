import { Button } from "@/components/ui/Button";
import { hexToRgba } from "@/lib/utils";

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
  accentColor?: string;
}

export function EmptyState({
  emoji,
  title,
  description,
  action,
  onAction,
  accentColor = "#6C63FF",
}: EmptyStateProps) {
  return (
    <div
      className="sv-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          marginBottom: 4,
        }}
      >
        {emoji}
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>
        {title}
      </p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: 280 }}>
        {description}
      </p>
      {action && onAction && (
        <div style={{ marginTop: 8 }}>
          <Button variant="primary" accentColor={accentColor} onClick={onAction}>
            {action}
          </Button>
        </div>
      )}
    </div>
  );
}
