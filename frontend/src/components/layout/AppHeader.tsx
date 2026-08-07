"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  List, MagnifyingGlass, Bell, CaretDown,
  User, Gear, SignOut, X,
} from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { hexToRgba, getInitials } from "@/lib/utils";
import { NotificationPanel } from "@/components/notifications/NotificationPanel";
import { GlobalSearch } from "@/components/search/GlobalSearch";

interface AppHeaderProps {
  onMenuClick: () => void;
  accentColor: string;
}

export function AppHeader({ onMenuClick, accentColor }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fechar user menu ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatarInitials = user?.username ? getInitials(user.username) : "?";
  const avatarUrl = `${process.env.NEXT_PUBLIC_API_URL}/${user?.avatar}`

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 20px",
          height: 56,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(13,14,28,0.9)",
          backdropFilter: "blur(8px)",
          flexShrink: 0,
          zIndex: 20,
        }}
      >
        {/* Mobile menu btn */}
        <button
          className="sv-mobile-menu-btn sv-icon-btn"
          onClick={onMenuClick}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "5px 7px", display: "none" }}
        >
          <List size={17} weight="bold" />
        </button>

        {/* Search bar */}
        <button
          onClick={() => setShowSearch(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            maxWidth: 380,
            padding: "7px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 9,
            color: "rgba(255,255,255,0.35)",
            fontSize: 13,
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.15s",
          }}
        >
          <MagnifyingGlass size={14} weight="bold" />
          <span>Pesquisar playlists, músicas...</span>
          <kbd style={{ marginLeft: "auto", padding: "1px 5px", borderRadius: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>⌘K</kbd>
        </button>

        <div style={{ flex: 1 }} />

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="sv-icon-btn"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "7px 8px", display: "flex", position: "relative" }}
          >
            <Bell size={17} weight={showNotifications ? "fill" : "duotone"} />
            {/* Badge contador */}
            <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "#ef4444", border: "1.5px solid #10111E" }} />
          </button>

          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User menu */}
        <div ref={userMenuRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px 5px 5px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {user?.avatar ? (
              <img src={avatarUrl} alt={user.username} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: hexToRgba(accentColor, 0.25), border: `1px solid ${hexToRgba(accentColor, 0.4)}`, display: "flex", alignItems: "center", justifyContent: "center", color: accentColor, fontSize: 11, fontWeight: 700 }}>
                {avatarInitials}
              </div>
            )}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", lineHeight: 1.2 }}>
                {user?.username ?? "Usuário"}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.2 }}>
                {user?.email ?? ""}
              </div>
            </div>
            <CaretDown size={12} weight="bold" style={{ color: "rgba(255,255,255,0.3)", marginLeft: 2 }} />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div
              className="sv-fade-in"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 200,
                background: "#1A1B2E",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{user?.username}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{user?.email}</div>
              </div>

              {[
                { href: "/profile", label: "Meu perfil",     icon: <User  size={14} weight="duotone" /> },
                { href: "/settings", label: "Configurações", icon: <Gear  size={14} weight="duotone" /> },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowUserMenu(false)}
                  className="sv-row"
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none", transition: "background 0.15s" }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                  onClick={async () => { setShowUserMenu(false); await logout(); }}
                  className="sv-row"
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", color: "#f87171", fontSize: 13, background: "none", border: "none", cursor: "pointer", transition: "background 0.15s", fontFamily: "inherit" }}
                >
                  <SignOut size={14} weight="duotone" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search overlay */}
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} accentColor={accentColor} />}
    </>
  );
}
