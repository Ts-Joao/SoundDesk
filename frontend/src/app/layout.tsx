import type { Metadata, Viewport } from "next";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SoundVault",
    template: "%s — SoundVault",
  },
  description: "Gerencie sua biblioteca musical pessoal com playlists, downloads e fila de processamento.",
  keywords: ["music", "library", "playlist", "download", "mp3"],
};

export const viewport: Viewport = {
  themeColor: "#0D0E1C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
