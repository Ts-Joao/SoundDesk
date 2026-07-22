import type { Metadata, Viewport } from "next";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "SoundDesk", template: "%s — SoundDesk" },
  description: "Plataforma multiusuário para gerenciamento de bibliotecas musicais.",
};

export const viewport: Viewport = { themeColor: "#0D0E1C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <Toaster
                  position="bottom-right"
                  theme="dark"
                  toastOptions={{
                    style: {
                      background: "#1A1B2E",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                    }
                  }}
              />
              {children}
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
