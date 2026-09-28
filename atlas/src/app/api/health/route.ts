import { neon } from "@neondatabase/serverless";
import { env } from "cloudflare:workers";

type Check = () => Promise<void>;
type HealthAdapters = { database?: Check; github?: Check };
type HealthState = "ok" | "unconfigured" | "error";

type RuntimeEnv = {
  DATABASE_URL?: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPOSITORY?: string;
};

const runtimeEnv = env as RuntimeEnv;

async function checkDatabase() {
  const sql = neon(runtimeEnv.DATABASE_URL!);
  await sql`SELECT 1`;
}

async function checkGitHub() {
  const response = await fetch(
    `https://api.github.com/repos/${runtimeEnv.GITHUB_REPOSITORY}/commits/HEAD`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${runtimeEnv.GITHUB_TOKEN}`,
        "User-Agent": "dsm-atlas-health",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  await response.body?.cancel();
}

export function createHealthHandler(adapters: HealthAdapters) {
  return async function GET() {
    const database = await runCheck(adapters.database);
    const github = await runCheck(adapters.github);
    const status = combine(database, github);

    return Response.json(
      { status, runtime: "cloudflare", database, github },
      { status: status === "ok" ? 200 : 503 },
    );
  };
}

async function runCheck(check?: Check): Promise<HealthState> {
  if (!check) return "unconfigured";

  try {
    await check();
    return "ok";
  } catch {
    return "error";
  }
}

function combine(database: HealthState, github: HealthState): HealthState {
  if (database === "error" || github === "error") return "error";
  if (database === "unconfigured" || github === "unconfigured") {
    return "unconfigured";
  }
  return "ok";
}

export const GET = createHealthHandler({
  database: runtimeEnv.DATABASE_URL ? checkDatabase : undefined,
  github:
    runtimeEnv.GITHUB_TOKEN && runtimeEnv.GITHUB_REPOSITORY
      ? checkGitHub
      : undefined,
});
