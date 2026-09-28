"use client";

import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
import { useEffect, useMemo, useState } from "react";
import { createIndexedDbStudyWorkspace } from "../study/indexed-db-study-store";
import { synchronizeStudy } from "../study/synchronize-study";
import type { RemoteStudyStore, SyncResult } from "../study/neon-study-store";

const authClient = createAuthClient({ plugins: [anonymousClient(), passkeyClient()] });

export function ProfileControls() {
  const workspace = useMemo(() => createIndexedDbStudyWorkspace(), []);
  const [profile, setProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [conflicts, setConflicts] = useState<SyncResult["conflicts"]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void authClient.getSession().then(({ data }) => setProfile(Boolean(data?.user)));
  }, []);

  async function createProfile() {
    setPending(true);
    setMessage("");
    try {
      const existing = await authClient.getSession();
      if (!existing.data) {
        const signedIn = await authClient.signIn.anonymous();
        if (signedIn.error) throw new Error(signedIn.error.message);
      }
      const added = await authClient.passkey.addPasskey({ createSession: false });
      if (added.error) throw new Error(added.error.message);
      setProfile(true);
      setMessage("Perfil protegido neste dispositivo.");
    } catch {
      setMessage("Não foi possível proteger o perfil com passkey.");
    } finally {
      setPending(false);
    }
  }

  async function signIn() {
    setPending(true);
    setMessage("");
    try {
      const result = await authClient.signIn.passkey();
      if (result.error) throw new Error(result.error.message);
      setProfile(true);
      await sync();
    } catch {
      setMessage("Não foi possível entrar com a passkey.");
    } finally {
      setPending(false);
    }
  }

  async function sync() {
    setPending(true);
    setMessage("");
    try {
      const result = await synchronizeStudy(workspace, httpStore, { deviceId: deviceId() });
      setConflicts(result.conflicts);
      setMessage(result.conflicts.length ? "Sincronizado com conflitos visíveis abaixo." : "Dados de estudo sincronizados.");
    } catch {
      setMessage("Sem conexão. As alterações continuam salvas neste dispositivo.");
    } finally {
      setPending(false);
    }
  }

  async function remove(keepLocal: boolean) {
    setPending(true);
    setMessage("");
    try {
      const proofResponse = await fetch("/api/profile/delete/proof", { method: "POST" });
      if (!proofResponse.ok) throw new Error("proof failed");
      const { proof } = await proofResponse.json() as { proof: string };
      const assertion = await authClient.signIn.passkey();
      if (assertion.error) throw new Error(assertion.error.message);
      const deleted = await fetch("/api/profile/delete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ proof }) });
      if (!deleted.ok) throw new Error("delete failed");
      if (!keepLocal) await workspace.clear();
      setProfile(false);
      setConflicts([]);
      setMessage(keepLocal ? "Perfil apagado. Dados mantidos neste dispositivo." : "Perfil e dados deste dispositivo apagados.");
    } catch {
      setMessage("Confirme uma passkey recente para apagar o perfil.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="profile-controls" aria-labelledby="profile-title" aria-busy={pending}>
      <h2 id="profile-title">Continuidade opcional</h2>
      <p>O histórico completo do tutor nunca é enviado. Só progresso, favoritos, notas e flashcards são sincronizados.</p>
      <div className="profile-actions">
        {!profile && <button type="button" disabled={pending} onClick={() => void createProfile()}>Proteger com passkey</button>}
        {!profile && <button type="button" disabled={pending} onClick={() => void signIn()}>Entrar em outro dispositivo</button>}
        {profile && <button type="button" disabled={pending} onClick={() => void sync()}>Sincronizar agora</button>}
        {profile && <button type="button" disabled={pending} onClick={() => void remove(true)}>Apagar perfil — Manter neste dispositivo</button>}
        {profile && <button type="button" disabled={pending} onClick={() => void remove(false)}>Apagar perfil — Apagar também</button>}
      </div>
      {message && <p role="status">{message}</p>}
      {conflicts.length > 0 && <div role="alert"><strong>Notas em conflito</strong>{conflicts.map((conflict) => <article key={conflict.id}><p>{conflict.versions[0].text}</p><p>{conflict.versions[1].text}</p></article>)}</div>}
    </section>
  );
}

const httpStore: RemoteStudyStore = {
  async sync(request) {
    const response = await fetch("/api/study/sync", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(request) });
    if (!response.ok) throw new Error("sync failed");
    return response.json() as Promise<SyncResult>;
  },
};

function deviceId(): string {
  const key = "dsm-atlas-device-id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(key, created);
  return created;
}
