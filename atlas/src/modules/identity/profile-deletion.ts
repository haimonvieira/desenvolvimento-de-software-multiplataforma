const PROOF_BYTES = 32;
const PROOF_LIFETIME_MS = 2 * 60_000;

export interface ProfileDeletionDatabase {
  query(sql: string, params: readonly unknown[]): Promise<readonly Record<string, unknown>[]>;
}

export function createProfileDeletionService(database: ProfileDeletionDatabase, now: () => Date = () => new Date()) {
  return {
    async begin(profileId: string): Promise<string> {
      const token = randomToken(PROOF_BYTES);
      await database.query(`
        WITH cleared AS (DELETE FROM profile_deletion_proof WHERE profile_id = $2)
        INSERT INTO profile_deletion_proof (token_hash, profile_id, expires_at) VALUES ($1, $2, $3)
      `, [await hash(token), profileId, new Date(now().getTime() + PROOF_LIFETIME_MS)]);
      return token;
    },
    async verifyCredential(credentialId: string): Promise<void> {
      await database.query(`
        UPDATE profile_deletion_proof proof SET verified_at = $2
        FROM passkey WHERE passkey.user_id = proof.profile_id AND passkey.credential_id = $1 AND proof.expires_at > $2
      `, [credentialId, now()]);
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

async function hash(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`delete-profile:${token}`));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomToken(bytes: number): string {
  const value = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...value)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
