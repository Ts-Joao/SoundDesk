"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Translate,
  CheckCircle,
  FloppyDisk,
  PaintBucket,
  FrameCorners,
  Check,
} from "@phosphor-icons/react";
import { Toggle, SegmentedControl, CoverArt } from "@/components/ui/index";
import { Button } from "@/components/ui/Button";
import { useAppSettings } from "@/hooks/useAppSettings";
import { ACCENT_COLORS, hexToRgba } from "@/lib/utils";

export function SettingsView() {
  const { settings, update } = useAppSettings();
  const [saved, setSaved] = useState(false);

  const { accentColor } = settings;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div
      style={{
        background: "#1A1B2E",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(255,255,255,0.7)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: hexToRgba(accentColor, 0.15),
            border: `1px solid ${hexToRgba(accentColor, 0.3)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
          }}
        >
          {icon}
        </div>
        {title}
      </div>
      <div
        style={{
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {children}
      </div>
    </div>
  );

  const Row = ({
    label,
    hint,
    children,
  }: {
    label: string;
    hint?: string;
    children: React.ReactNode;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}
        >
          {label}
        </div>
        {hint && (
          <div
            style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", marginTop: 2 }}
          >
            {hint}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );

  const Divider = () => (
    <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
  );

  return (
    <div style={{ padding: 24, maxWidth: 640 }} className="sv-fade-in">

      {/* Aparência */}
      <Section title="Aparência" icon={<PaintBucket size={14} weight="duotone" />}>
        <Row label="Tema" hint="Escolha entre modo claro ou escuro">
          <SegmentedControl
            value={settings.theme}
            onChange={(v) => update("theme", v as "dark" | "light")}
            accentColor={accentColor}
            options={[
              { value: "dark",  label: "Escuro", icon: <Moon size={13} weight="fill" /> },
              { value: "light", label: "Claro",  icon: <Sun  size={13} weight="fill" /> },
            ]}
          />
        </Row>

        <Divider />

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <div
              style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}
            >
              Cor de destaque
            </div>
            <CoverArt color={accentColor} name="SV" size={28} />
          </div>
          <div
            style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", marginBottom: 12 }}
          >
            Personalize a cor principal da interface
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {ACCENT_COLORS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("accentColor", opt.value)}
                title={opt.name}
                className="sv-color-swatch"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: opt.value,
                  border:
                    accentColor === opt.value
                      ? "2px solid #fff"
                      : "2px solid transparent",
                  outline:
                    accentColor === opt.value ? `2px solid ${opt.value}` : "none",
                  outlineOffset: 2,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 14,
                  transition: "transform 0.15s",
                  boxSizing: "border-box",
                }}
              >
                {accentColor === opt.value && (
                  <Check size={14} weight="bold" />
                )}
              </button>
            ))}
          </div>
        </div>

        <Divider />

        <Row
          label="Modo compacto"
          hint="Reduz espaçamentos para exibir mais conteúdo"
        >
          <Toggle
            value={settings.compactMode}
            onChange={(v) => update("compactMode", v)}
            accentColor={accentColor}
          />
        </Row>

        <Row label="Animações" hint="Transições e efeitos visuais suaves">
          <Toggle
            value={settings.animations}
            onChange={(v) => update("animations", v)}
            accentColor={accentColor}
          />
        </Row>
      </Section>

      {/* Notificações */}
      <Section title="Notificações" icon={<Bell size={14} weight="duotone" />}>
        <Row
          label="Notificações de download"
          hint="Avisar quando um download concluir ou falhar"
        >
          <Toggle
            value={settings.notifications}
            onChange={(v) => update("notifications", v)}
            accentColor={accentColor}
          />
        </Row>
      </Section>

      {/* Idioma */}
      <Section title="Idioma e Região" icon={<Translate size={14} weight="duotone" />}>
        <Row label="Idioma da interface" hint="Idioma usado em toda a aplicação">
          <SegmentedControl
            value={settings.language}
            onChange={(v) => update("language", v as "pt-BR" | "en-US")}
            accentColor={accentColor}
            options={[
              { value: "pt-BR", label: "Português" },
              { value: "en-US", label: "English" },
            ]}
          />
        </Row>
      </Section>

      {/* Acessibilidade */}
      <Section
        title="Acessibilidade"
        icon={<FrameCorners size={14} weight="duotone" />}
      >
        <Row
          label="Reduzir movimento"
          hint="Desativa animações para usuários sensíveis a movimento"
        >
          <Toggle
            value={!settings.animations}
            onChange={(v) => update("animations", !v)}
            accentColor={accentColor}
          />
        </Row>
      </Section>

      {/* Save */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button
          onClick={handleSave}
          variant={saved ? "success" : "primary"}
          accentColor={accentColor}
          icon={
            saved ? (
              <CheckCircle size={15} weight="fill" />
            ) : (
              <FloppyDisk size={15} weight="bold" />
            )
          }
        >
          {saved ? "Salvo com sucesso!" : "Salvar configurações"}
        </Button>
      </div>
    </div>
  );
}
