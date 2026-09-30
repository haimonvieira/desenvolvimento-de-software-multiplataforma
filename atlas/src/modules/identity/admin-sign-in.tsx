"use client";

import { createAuthClient } from "better-auth/react";
import Link from "next/link";
import { useState } from "react";

/**
 * Where Better Auth returns the browser after the OAuth callback establishes the
 * session: back to the entry point, which then runs the bootstrap server-side.
 * It is *not* the OAuth `redirect_uri` — Better Auth builds that itself as
 * `${baseURL}/api/auth/callback/github`.
 */
export const ADMIN_SIGN_IN_CALLBACK_URL = "/admin/entrar";

export interface SocialSignInClient {
  signIn: { social(options: { provider: string; callbackURL: string }): Promise<{ error?: { message?: string } | null }> };
  signOut(): Promise<unknown>;
}

/** Starts Better Auth's documented GitHub social sign-in; never hand-rolls the authorize URL. */
export async function startAdminGitHubSignIn(
  client: SocialSignInClient,
  options: Readonly<{ replaceAccount?: boolean }> = {},
): Promise<boolean> {
  if (options.replaceAccount) await client.signOut();
  const { error } = await client.signIn.social({ provider: "github", callbackURL: ADMIN_SIGN_IN_CALLBACK_URL });
  return !error;
}

const authClient = createAuthClient();

export function AdminSignIn({ reason }: Readonly<{ reason: "unauthenticated" | "not-owner" }>) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function start(replaceAccount: boolean) {
    setPending(true);
    setMessage("");
    try {
      if (!(await startAdminGitHubSignIn(authClient, { replaceAccount }))) {
        setMessage("Não foi possível iniciar a entrada com GitHub. Tente novamente.");
        setPending(false);
      }
    } catch {
      setMessage("Não foi possível iniciar a entrada com GitHub. Tente novamente.");
      setPending(false);
    }
  }

  const replacing = reason === "not-owner";

  return (
    <section className="admin-entry" aria-labelledby="admin-entry-title" aria-busy={pending}>
      <h1 id="admin-entry-title">Administração</h1>
      <p>
        {replacing
          ? "A conta GitHub desta sessão não é o proprietário configurado do Atlas. Saia dela e entre com a conta do proprietário."
          : "Esta área é restrita ao proprietário do Atlas. Entre com a conta GitHub configurada como proprietária."}
      </p>
      <button type="button" onClick={() => void start(replacing)} disabled={pending}>
        {replacing ? "Entrar com outra conta GitHub" : "Entrar com GitHub"}
      </button>
      {message ? <p role="alert">{message}</p> : null}
      <p><Link href="/">Voltar ao atlas</Link></p>
    </section>
  );
}
