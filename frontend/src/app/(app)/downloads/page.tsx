import type { Metadata } from "next";
import { DownloadsView } from "@/components/views/DownloadsView";
export const metadata: Metadata = { title: "Downloads" };
export default function DownloadsPage() { return <DownloadsView />; }
