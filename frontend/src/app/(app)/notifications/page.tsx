import type { Metadata } from "next";
import { NotificationsView } from "@/components/views/NotificationsView";
export const metadata: Metadata = { title: "Notificações" };
export default function NotificationsPage() { return <NotificationsView />; }
