"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Envelope, Lock, Spinner } from "@phosphor-icons/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/shadcn/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/shadcn/alert-dialog";
import { Button, Input, Label } from "@/components/shadcn/ui";
import { changeEmailService } from "@/services/auth.service";

// ─── Schema de validação ────────────────────────────────────────────────────

const schema = z.object({
  new_email: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("Digite um e-mail válido"),
  password: z
    .string()
    .min(1, "Senha obrigatória"),
});

type FormData = z.infer<typeof schema>;

// ─── Props ──────────────────────────────────────────────────────────────────

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
}

// ─── Componente ─────────────────────────────────────────────────────────────

export function ChangeEmailDialog({
  open,
  onOpenChange,
  currentEmail,
}: ChangeEmailDialogProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { new_email: "", password: "" },
  });

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (data: FormData) => {
    try {
      await changeEmailService.changeEmail({
        new_email: data.new_email,
        password: data.password,
      });

      // Fechar o Dialog de formulário e abrir o de sucesso
      onOpenChange(false);
      reset();
      setShowSuccess(true);
    } catch (err: any) {
      // Extrair mensagem de erro do backend
      let message = "Não foi possível alterar o e-mail.";
      try {
        const parsed = JSON.parse(err.message);
        message = parsed?.detail ?? parsed?.message ?? message;
      } catch {
        message = err.message ?? message;
      }
      toast.error("Erro ao alterar e-mail", { description: message });
      // Dialog permanece aberto, campos mantidos
    }
  };

  // ── Fechar o Dialog de formulário limpando os campos ─────────────────────

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isSubmitting) {
      if (!nextOpen) reset();
      onOpenChange(nextOpen);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Dialog: formulário ──────────────────────────────────────── */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Alterar e-mail</DialogTitle>
            <DialogDescription>
              Informe o novo endereço e sua senha atual para confirmar. Um link
              de verificação será enviado para o novo e-mail.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <DialogBody className="flex flex-col gap-5">

              {/* E-mail atual — somente leitura */}
              <div className="flex flex-col gap-1.5">
                <Label>E-MAIL ATUAL</Label>
                <div className="flex h-9 w-full items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white/35 select-none cursor-default">
                  <Envelope size={14} className="shrink-0 text-white/20" />
                  <span className="truncate">{currentEmail}</span>
                </div>
              </div>

              {/* Novo e-mail */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new_email">NOVO E-MAIL</Label>
                <div className="relative">
                  <Envelope
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                  />
                  <Input
                    id="new_email"
                    type="email"
                    placeholder="novo@email.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.new_email}
                    className="pl-8 aria-[invalid=true]:border-red-500/50 aria-[invalid=true]:focus:ring-red-500/10"
                    {...register("new_email")}
                  />
                </div>
                {errors.new_email && (
                  <p className="text-xs text-red-400 mt-0.5">
                    {errors.new_email.message}
                  </p>
                )}
              </div>

              {/* Senha atual */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">SENHA ATUAL</Label>
                <div className="relative">
                  <Lock
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.password}
                    className="pl-8 aria-[invalid=true]:border-red-500/50 aria-[invalid=true]:focus:ring-red-500/10"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

            </DialogBody>

            <DialogFooter>
              {/* Cancelar */}
              <Button
                type="button"
                variant="ghost"
                size="md"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>

              {/* Continuar */}
              <Button
                type="submit"
                variant="default"
                size="md"
                disabled={isSubmitting}
                className="min-w-[110px]"
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      size={14}
                      className="animate-spin"
                      aria-hidden
                    />
                    Enviando…
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── AlertDialog: confirmação de sucesso ─────────────────────── */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {/* Ícone de sucesso */}
            <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Envelope size={20} className="text-emerald-400" />
            </div>
            <AlertDialogTitle>Tudo certo!</AlertDialogTitle>
            <AlertDialogDescription>
              Enviamos um e-mail de confirmação para o novo endereço informado.
              A alteração somente será concluída após você clicar no link
              enviado para esse e-mail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button
                variant="default"
                size="md"
                onClick={() => setShowSuccess(false)}
                className="w-full"
              >
                Entendi
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
