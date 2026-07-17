import type { Metadata } from "next";
import { SharedView } from "@/components/views/SharedView";
export const metadata: Metadata = { title: "Compartilhadas" };
export default function SharedPage() { return <SharedView />; }
