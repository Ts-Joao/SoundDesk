import { getInitials } from "@/lib/utils";

interface CoverArtProps {
  color: string;
  name: string;
  size?: number;
}

export function CoverArt({ color, name, size = 44 }: CoverArtProps) {
  const isLarge = size > 60;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: isLarge ? 12 : 8,
        background: `${color}22`,
        border: `1px solid ${color}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        fontSize: isLarge ? 24 : 14,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {isLarge ? "♫" : getInitials(name)}
    </div>
  );
}
