import { generateAuthenticationOptions, verifyAuthenticationResponse, type AuthenticationResponseJSON } from "@simplewebauthn/server";
import type { ProfileDeletionDatabase } from "./profile-deletion";
import { createProfileDeletionService } from "./profile-deletion";

export async function beginProfileDeletionCeremony(database: ProfileDeletionDatabase, profileId: string, rpId: string) {
  const credentials = await database.query("SELECT credential_id, transports FROM passkey WHERE user_id = $1", [profileId]);
  const options = await generateAuthenticationOptions({
    rpID: rpId,
    userVerification: "required",
    allowCredentials: credentials.map(({ credential_id, transports }) => ({
      id: String(credential_id),
      transports: typeof transports === "string" ? transports.split(",") as AuthenticatorTransport[] : undefined,
    })),
  });
  const proof = await createProfileDeletionService(database).begin(profileId, options.challenge);
  return { options, proof };
}

export async function verifyProfileDeletionCeremony(
  database: ProfileDeletionDatabase,
  input: Readonly<{ profileId: string; rpId: string; origin: string; response: AuthenticationResponseJSON }>,
): Promise<boolean> {
  const rows = await database.query(`
    SELECT p.public_key, p.counter, p.transports, d.challenge_hash
    FROM passkey p JOIN profile_deletion_proof d ON d.profile_id = p.user_id
    WHERE p.user_id = $1 AND p.credential_id = $2 AND d.expires_at > now() AND d.verified_at IS NULL
  `, [input.profileId, input.response.id]);
  const credential = rows[0];
  if (!credential) return false;
  const clientData = JSON.parse(new TextDecoder().decode(base64Url(input.response.response.clientDataJSON))) as { challenge: string };
  const digest = await proofHash(clientData.challenge);
  if (digest !== credential.challenge_hash) return false;
  const verification = await verifyAuthenticationResponse({
    response: input.response,
    expectedChallenge: clientData.challenge,
    expectedOrigin: input.origin,
    expectedRPID: input.rpId,
    credential: {
      id: input.response.id,
      publicKey: new Uint8Array(base64Url(String(credential.public_key))),
      counter: Number(credential.counter),
      transports: typeof credential.transports === "string" ? credential.transports.split(",") as AuthenticatorTransport[] : undefined,
    },
    requireUserVerification: true,
  });
  if (!verification.verified) return false;
  await database.query("UPDATE passkey SET counter = $2 WHERE user_id = $1 AND credential_id = $3", [input.profileId, verification.authenticationInfo.newCounter, input.response.id]);
  await createProfileDeletionService(database).verifyCeremony(input.response.id, clientData.challenge);
  return true;
}

async function proofHash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`delete-profile:${value}`));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function base64Url(value: string): Uint8Array {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}
