import type { Metadata } from "next";
import { FavoritesView } from "@/components/views/FavoritesView";
export const metadata: Metadata = { title: "Favoritos" };
export default function FavoritesPage() { return <FavoritesView />; }
