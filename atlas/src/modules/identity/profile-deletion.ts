const PROOF_BYTES = 32;
const PROOF_LIFETIME_MS = 2 * 60_000;

export interface ProfileDeletionDatabase {
  query(sql: string, params: readonly unknown[]): Promise<readonly Record<string, unknown>[]>;
}

export function createProfileDeletionService(database: ProfileDeletionDatabase, now: () => Date = () => new Date()) {
  return {
    async begin(profileId: string, challenge: string): Promise<string> {
      const token = randomToken(PROOF_BYTES);
      await database.query(`
        INSERT INTO profile_deletion_proof (token_hash, profile_id, challenge_hash, expires_at, verified_at)
        VALUES ($1, $2, $3, $4, NULL)
        ON CONFLICT (profile_id) DO UPDATE SET token_hash=EXCLUDED.token_hash, challenge_hash=EXCLUDED.challenge_hash, expires_at=EXCLUDED.expires_at, verified_at=NULL
      `, [await hash(token), profileId, await hash(challenge), new Date(now().getTime() + PROOF_LIFETIME_MS)]);
      return token;
    },
    async verifyCeremony(credentialId: string, challenge: string): Promise<void> {
      await database.query(`
        UPDATE profile_deletion_proof proof SET verified_at = $3
        FROM passkey
        WHERE passkey.user_id = proof.profile_id AND passkey.credential_id = $1
          AND proof.challenge_hash = $2 AND proof.expires_at > $3
      `, [credentialId, await hash(challenge), now()]);
    },
    async consumeAndDelete(profileId: string, token: string): Promise<boolean> {
      const rows = await database.query(`
        WITH consumed AS (
          DELETE FROM profile_deletion_proof
          WHERE token_hash = $1 AND profile_id = $2 AND expires_at > $3 AND verified_at IS NOT NULL
          RETURNING profile_id
        )
        DELETE FROM "user"
        WHERE id = $2 AND EXISTS (SELECT 1 FROM consumed)
        RETURNING id
      `, [await hash(token), profileId, now()]);
      return rows.length === 1;
    },
  };
}

async function hash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`delete-profile:${value}`));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomToken(bytes: number): string {
  const value = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...value)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
