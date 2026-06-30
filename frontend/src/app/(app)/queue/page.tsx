import type { Metadata } from "next";
import { QueueView } from "@/components/views/QueueView";

export const metadata: Metadata = { title: "Fila de Processamento" };

export default function QueuePage() {
  return <QueueView />;
}
