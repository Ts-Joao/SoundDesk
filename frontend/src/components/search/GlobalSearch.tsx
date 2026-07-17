"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MagnifyingGlass, MusicNotes, DownloadSimple, X, ArrowRight } from "@phosphor-icons/react";
import { hexToRgba } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: "playlist" | "track" | "download";
  title: string;
  subtitle: string;
  href: string;
  color?: string;
}

// Busca local nos mocks — substituir por fetch ao backend
function useLiveSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        // TODO: GET /search?q=query
        // Por ora simula resultados baseados na query
        const mock = ([
          { id: "pl-1", type: "playlist", title: "Lofi Hip Hop Chill",    subtitle: "24 músicas",  href: "/playlists/pl-1", color: "#6C63FF" },
          { id: "pl-2", type: "playlist", title: "Brazilian Jazz Classics", subtitle: "18 músicas", href: "/playlists/pl-2", color: "#FF6584" },
          { id: "tr-1", type: "track",    title: "Midnight Study Session",  subtitle: "ChilledCow · Lofi Hip Hop Chill", href: "/library" },
          { id: "tr-2", type: "track",    title: "Garota de Ipanema",       subtitle: "Tom Jobim · Brazilian Jazz",       href: "/library" },
          { id: "dw-1", type: "download", title: "Coffee Shop Vibes",       subtitle: "Processando · 67%",               href: "/downloads" },
        ] as SearchResult[]).filter((r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(query.toLowerCase())
        );
        setResults(mock);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  return { results, loading };
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  playlist: <MusicNotes  size={15} weight="duotone" />,
  track:    <MusicNotes  size={15} weight="duotone" />,
  download: <DownloadSimple size={15} weight="duotone" />,
};

const TYPE_LABEL: Record<string, string> = {
  playlist: "Playlist",
  track:    "Música",
  download: "Download",
};

interface GlobalSearchProps {
  onClose: () => void;
  accentColor: string;
}

export function GlobalSearch({ onClose, accentColor }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const { results, loading } = useLiveSearch(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focar ao abrir + fechar com Escape
  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const grouped = {
    playlist: results.filter((r) => r.type === "playlist"),
    track:    results.filter((r) => r.type === "track"),
    download: results.filter((r) => r.type === "download"),
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px 16px 16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="sv-fade-in"
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#1A1B2E",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderBottom: query ? "1px solid rgba(255,255,255,0.07)" : "none",
          }}
        >
          <MagnifyingGlass size={18} weight="bold" style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar playlists, músicas, downloads..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 15,
              fontFamily: "inherit",
            }}
          />
          {loading && (
            <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: accentColor, borderRadius: "50%", animation: "sv-spin 0.8s linear infinite", flexShrink: 0 }} />
          )}
          <button
            onClick={onClose}
            className="sv-icon-btn"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "3px 7px", fontSize: 11, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}
          >
            <X size={12} weight="bold" />
            <span>ESC</span>
          </button>
        </div>

        {/* Results */}
        {query && (
          <div style={{ maxHeight: 440, overflowY: "auto" }}>
            {results.length === 0 && !loading ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
                  Nenhum resultado para <strong style={{ color: "rgba(255,255,255,0.6)" }}>"{query}"</strong>
                </p>
              </div>
            ) : (
              (["playlist", "track", "download"] as const).map((type) => {
                const items = grouped[type];
                if (!items.length) return null;
                return (
                  <div key={type}>
                    <div style={{ padding: "10px 16px 5px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
                      {TYPE_LABEL[type].toUpperCase() + "S"}
                    </div>
                    {items.map((result) => (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={onClose}
                        className="sv-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 16px",
                          textDecoration: "none",
                          transition: "background 0.1s",
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 7,
                            background: result.color ? `${result.color}22` : "rgba(255,255,255,0.06)",
                            border: `1px solid ${result.color ? result.color + "33" : "rgba(255,255,255,0.08)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: result.color ?? "rgba(255,255,255,0.4)",
                            flexShrink: 0,
                          }}
                        >
                          {TYPE_ICON[result.type]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {result.title}
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {result.subtitle}
                          </div>
                        </div>
                        <ArrowRight size={14} weight="bold" style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                      </Link>
                    ))}
                  </div>
                );
              })
            )}

            {/* Ver todos os resultados */}
            {results.length > 0 && (
              <div style={{ padding: "10px 16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4 }}>
                <button
                  onClick={onClose}
                  style={{ width: "100%", padding: "8px", background: hexToRgba(accentColor, 0.1), border: `1px solid ${hexToRgba(accentColor, 0.2)}`, borderRadius: 8, color: accentColor, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Ver todos os resultados para "{query}"
                </button>
              </div>
            )}
          </div>
        )}

        {/* Estado inicial - dicas */}
        {!query && (
          <div style={{ padding: "16px 16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em", marginBottom: 10 }}>
              NAVEGAÇÃO RÁPIDA
            </div>
            {[
              { label: "Dashboard",     href: "/dashboard" },
              { label: "Playlists",     href: "/playlists" },
              { label: "Downloads",     href: "/downloads" },
              { label: "Configurações", href: "/settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="sv-row"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", transition: "background 0.1s" }}
              >
                {item.label}
                <ArrowRight size={13} weight="bold" style={{ color: "rgba(255,255,255,0.2)" }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
