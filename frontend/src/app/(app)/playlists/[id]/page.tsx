import type { Metadata } from "next";
import { PlaylistDetailView } from "@/components/views/PlaylistDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Playlist ${id}` };
}

export default async function PlaylistDetailPage({ params }: Props) {
  const { id } = await params;
  return <PlaylistDetailView playlistId={id} />;
}
