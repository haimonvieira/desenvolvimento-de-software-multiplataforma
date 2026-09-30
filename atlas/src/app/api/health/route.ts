import { neon } from "@neondatabase/serverless";
import { env } from "cloudflare:workers";

import {
  createGitHubInstallationTransport,
  githubAppConfigured,
  repositoryFromEnv,
  type GitHubAppDeps,
  type GitHubAppEnv,
} from "../../../integrations/github/github-material-source";

type Check = () => Promise<void>;
type HealthAdapters = { database?: Check; github?: Check };
type HealthState = "ok" | "unconfigured" | "error";

type RuntimeEnv = GitHubAppEnv & { DATABASE_URL?: string };

const runtimeEnv = env as RuntimeEnv;

async function checkDatabase() {
  const sql = neon(runtimeEnv.DATABASE_URL!);
  await sql`SELECT 1`;
}

/**
 * Health must exercise the same authentication production uses, so it mints a
 * real installation token instead of a bare token: an App credential that has
 * been revoked turns the check red rather than reporting a false "ok".
 */
export function createGitHubHealthCheck(
  runtime: RuntimeEnv,
  deps: GitHubAppDeps = {},
): Check {
  return async () => {
    const response = await createGitHubInstallationTransport(runtime, deps)(
      `/repos/${repositoryFromEnv(runtime)}/commits/HEAD`,
      { method: "GET" },
    );
    // Only the status matters here, so the body is released on both paths.
    await response.cancel?.();
    if (response.status >= 400) throw new Error(`GitHub returned ${response.status}`);
  };
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
  } catch (error) {
    // The response body stays opaque, but swallow nothing: an operator needs
    // the message to tell a 403 (bad credentials/header) from a timeout. These
    // paths build their errors from status codes, so no provider body leaks.
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`health check failed: ${detail}`);
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
  github: githubAppConfigured(runtimeEnv)
    ? createGitHubHealthCheck(runtimeEnv)
    : undefined,
});
