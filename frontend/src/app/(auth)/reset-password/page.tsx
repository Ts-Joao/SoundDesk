import { Metadata } from "next";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Redefinir senha" };

// 1. Defina a tipagem declarando o searchParams como uma Promise
interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

// 2. Transforme o componente em uma função assíncrona (async)
export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token ?? "";

  return <ResetPasswordForm token={token} />;
}