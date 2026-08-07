import type { Metadata } from "next";
import { ExportsView } from "@/components/views/ExportsView";
export const metadata: Metadata = { title: "Exportações" };
export default function ExportsPage() { return <ExportsView />; }
