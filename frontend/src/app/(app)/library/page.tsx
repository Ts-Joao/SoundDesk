import type { Metadata } from "next";
import { LibraryView } from "@/components/views/LibraryView";

export const metadata: Metadata = { title: "Biblioteca" };

export default function LibraryPage() {
  return <LibraryView />;
}
