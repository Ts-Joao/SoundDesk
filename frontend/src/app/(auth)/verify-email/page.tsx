import { Metadata } from "next";
import { VerifyEmailView } from "./VerifyEmailView";

export const metadata: Metadata = { title: "Verificar e-mail" };

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token ?? "";

  return <VerifyEmailView token={token} />;
}