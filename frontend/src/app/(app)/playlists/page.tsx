import type { Metadata } from "next";
import { PlaylistsView } from "@/components/views/PlaylistsView";

export const metadata: Metadata = { title: "Playlists" };

export default function PlaylistsPage() {
  return <PlaylistsView />;
}
