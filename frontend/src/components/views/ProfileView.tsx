"use client";

import { useState, useRef } from "react";
import {
  User, Envelope, Lock, Camera, Trash, Check,
  FloppyDisk, Warning, PencilSimple,
} from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateProfile, useUploadAvatar, useChangePassword, useDeleteAccount } from "@/hooks/profile/useProfile";
import { useToast } from "@/contexts/ToastContext";
import { hexToRgba, getInitials } from "@/lib/utils";
import { ConfirmDialog } from "@/components/modals/index";
import { ChangeEmailDialog } from "@/components/profile/change-email-dialog";

const ACCENT = "#6C63FF";

export function ProfileView() {
  const { user } = useAuth();
  const toast = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Perfil (apenas nome — email é read-only)
  const [name, setName] = useState(user?.name ?? "");
  const updateProfile = useUpdateProfile();

  // Change email dialog
  const [showChangeEmail, setShowChangeEmail] = useState(false);

  // Senha
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError]     = useState("");
  const changePassword = useChangePassword();

  // Avatar
  const uploadAvatar = useUploadAvatar();

  // Delete account
  const [showDelete, setShowDelete] = useState(false);
  const deleteAccount = useDeleteAccount();

  const handleSaveProfile = async () => {
    await updateProfile.mutateAsync({ name });
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) { setPwError("Preencha todos os campos."); return; }
    if (newPw !== confirmPw)                 { setPwError("As senhas não coincidem."); return; }
    if (newPw.length < 8)                   { setPwError("Mínimo 8 caracteres."); return; }
    setPwError("");
    await changePassword.mutateAsync({ currentPassword: currentPw, newPassword: newPw });
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { toast.error("Arquivo muito grande", "Máximo 4MB"); return; }
    await uploadAvatar.mutateAsync(file);
  };

  // ── Sub-componentes de layout ────────────────────────────────────────────

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: hexToRgba(ACCENT, 0.15), border: `1px solid ${hexToRgba(ACCENT, 0.3)}`, display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT }}>
          {icon}
        </div>
        {title}
      </div>
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff",
    fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  // ────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 24, maxWidth: 640 }} className="sv-fade-in">

      {/* Foto de Perfil */}
      <Section title="Foto de Perfil" icon={<Camera size={14} weight="duotone" />}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative" }}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)" }}
              />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: hexToRgba(ACCENT, 0.2), border: `2px solid ${hexToRgba(ACCENT, 0.35)}`, display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT, fontSize: 22, fontWeight: 700 }}>
                {getInitials(user?.name ?? "?")}
              </div>
            )}
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: ACCENT, border: "2px solid #1A1B2E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }}
            >
              <Camera size={11} weight="bold" />
            </button>
          </div>
          <div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 8px" }}>JPG, PNG ou GIF. Máximo 4MB.</p>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="sv-btn"
              style={{ padding: "6px 14px", background: hexToRgba(ACCENT, 0.15), border: `1px solid ${hexToRgba(ACCENT, 0.3)}`, borderRadius: 8, color: ACCENT, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              {uploadAvatar.isPending ? "Enviando..." : "Trocar foto"}
            </button>
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
        </div>
      </Section>

      {/* Dados Pessoais */}
      <Section title="Dados Pessoais" icon={<User size={14} weight="duotone" />}>

        {/* Nome — editável */}
        <Field label="NOME">
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", display: "flex" }}>
              <User size={14} weight="bold" />
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="sv-input"
              style={{ ...inputStyle, paddingLeft: 32 }}
            />
          </div>
        </Field>

        {/* E-mail — somente leitura + botão Alterar */}
        <Field label="E-MAIL">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Campo read-only */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                color: "rgba(255,255,255,0.35)",
                fontSize: 14,
                userSelect: "none",
                cursor: "default",
              }}
            >
              <Envelope size={14} weight="bold" style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email ?? "—"}
              </span>
            </div>

            {/* Botão Alterar e-mail */}
            <button
              onClick={() => setShowChangeEmail(true)}
              className="sv-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "rgba(255,255,255,0.55)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              <PencilSimple size={13} weight="bold" />
              Alterar e-mail
            </button>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
            Um link de confirmação será enviado ao novo endereço.
          </p>
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSaveProfile}
            disabled={updateProfile.isPending}
            className="sv-btn"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: hexToRgba(ACCENT, 0.2), border: `1px solid ${hexToRgba(ACCENT, 0.4)}`, borderRadius: 8, color: ACCENT, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            <FloppyDisk size={14} weight="bold" />
            {updateProfile.isPending ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </Section>

      {/* Alterar Senha */}
      <Section title="Alterar Senha" icon={<Lock size={14} weight="duotone" />}>
        <Field label="SENHA ATUAL">
          <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" className="sv-input" style={inputStyle} />
        </Field>
        <Field label="NOVA SENHA">
          <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Mínimo 8 caracteres" className="sv-input" style={inputStyle} />
        </Field>
        <Field label="CONFIRMAR NOVA SENHA">
          <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Repita a nova senha" className="sv-input" style={inputStyle} />
        </Field>
        {pwError && <p style={{ fontSize: 12, color: "#f87171", marginBottom: 10 }}>{pwError}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleChangePassword}
            disabled={changePassword.isPending}
            className="sv-btn"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: hexToRgba(ACCENT, 0.2), border: `1px solid ${hexToRgba(ACCENT, 0.4)}`, borderRadius: 8, color: ACCENT, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            <Check size={14} weight="bold" />
            {changePassword.isPending ? "Alterando..." : "Alterar senha"}
          </button>
        </div>
      </Section>

      {/* Zona de perigo */}
      <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Warning size={16} weight="fill" style={{ color: "#f87171" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#f87171" }}>Excluir conta</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente.
            </p>
          </div>
          <button
            onClick={() => setShowDelete(true)}
            className="sv-btn"
            style={{ padding: "8px 16px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit", whiteSpace: "nowrap" }}
          >
            <Trash size={14} weight="bold" />
            Excluir conta
          </button>
        </div>
      </div>

      {/* ── Dialogs ─────────────────────────────────────────────────────── */}

      {/* Change Email Dialog */}
      <ChangeEmailDialog
        open={showChangeEmail}
        onOpenChange={setShowChangeEmail}
        currentEmail={user?.email ?? ""}
      />

      {/* Confirm delete account */}
      {showDelete && (
        <ConfirmDialog
          title="Excluir conta permanentemente"
          message="Tem certeza? Esta ação não pode ser desfeita. Todos os seus dados, playlists e músicas serão removidos."
          danger
          onConfirm={() => deleteAccount.mutate()}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
