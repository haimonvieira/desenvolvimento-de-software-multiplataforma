import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { AdminAuthorizationError } from "../../../modules/identity/admin-authorizer";

const state = vi.hoisted(() => ({
  session: (async () => null) as () => Promise<{ user: { id: string } } | null>,
  bootstrap: (async () => ({ adminId: "owner", created: true })) as () => Promise<{ adminId: string; created: boolean }>,
  redirects: [] as string[],
}));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("next/navigation", () => ({
  redirect: (url: string): never => {
    state.redirects.push(url);
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));
vi.mock("better-auth/react", () => ({
  createAuthClient: () => ({ signIn: { social: async () => ({ error: null }) }, signOut: async () => undefined }),
}));
vi.mock("../../../modules/identity/server-auth", () => ({
  requiredRuntimeEnv: () => "https://atlas.example",
  serverAdmin: { bootstrap: () => state.bootstrap() },
  serverAuth: { api: { getSession: () => state.session() } },
}));

import AdminEntryPage from "./page";

async function capturedSignal(run: () => Promise<unknown>): Promise<unknown> {
  try {
    await run();
    return null;
  } catch (error) {
    return error;
  }
}

describe("GET /admin/entrar", () => {
  it("renders the GitHub entry point for a non-admin visitor", async () => {
    state.session = async () => null;
    state.redirects = [];

    const html = renderToStaticMarkup(await AdminEntryPage());

    expect(html).toContain("Entrar com GitHub");
    expect(state.redirects).toEqual([]);
  });

  it("redirects an already-bootstrapped owner straight to /admin", async () => {
    state.session = async () => ({ user: { id: "owner" } });
    state.bootstrap = async () => ({ adminId: "owner", created: false });
    state.redirects = [];

    expect(await capturedSignal(() => AdminEntryPage())).toMatchObject({ message: "NEXT_REDIRECT:/admin" });
    expect(state.redirects).toEqual(["/admin"]);
  });

  it("refuses a non-owner GitHub session with a clear message instead of a redirect", async () => {
    state.session = async () => ({ user: { id: "visitor" } });
    state.bootstrap = async () => {
      throw new AdminAuthorizationError();
    };
    state.redirects = [];

    const html = renderToStaticMarkup(await AdminEntryPage());

    expect(html).toContain("não é o proprietário");
    expect(state.redirects).toEqual([]);
  });
});
