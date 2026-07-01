import { hexToRgba } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  accentColor?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  accentColor = "#6C63FF",
}: SegmentedControlProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 9,
        padding: 3,
        gap: 2,
      }}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 7,
              border: "none",
              background: active ? hexToRgba(accentColor, 0.22) : "transparent",
              color: active ? accentColor : "rgba(255,255,255,0.4)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {opt.icon && <span>{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
