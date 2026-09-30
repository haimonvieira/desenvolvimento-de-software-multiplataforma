import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { AdminAuthorizationError } from "../src/modules/identity/admin-authorizer";

const state = vi.hoisted(() => ({
  requireAdmin: async (): Promise<{ adminId: string }> => ({ adminId: "owner" }),
}));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("../src/modules/identity/server-auth", () => ({
  requiredRuntimeEnv: () => "https://atlas.example",
  serverAdmin: { requireAdmin: () => state.requireAdmin() },
}));

import AdminPage from "../src/app/admin/page";

async function capturedFailure(run: () => Promise<unknown>): Promise<unknown> {
  try {
    await run();
    return null;
  } catch (error) {
    return error;
  }
}

describe("GET /admin", () => {
  it("hands the framework its 403 response signal for a non-admin", async () => {
    // `forbidden()` is gated on `experimental.authInterrupts`. The harness runs
    // the real Next implementation, so it needs the flag set here; next.config.ts
    // declares the same for a Next-rendered build.
    process.env.__NEXT_EXPERIMENTAL_AUTH_INTERRUPTS = "true";
    state.requireAdmin = async () => {
      throw new AdminAuthorizationError();
    };

    expect(await capturedFailure(() => AdminPage())).toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;403" });
  });

  it("renders the administration page for the configured owner", async () => {
    state.requireAdmin = async () => ({ adminId: "owner" });

    expect(renderToStaticMarkup(await AdminPage())).toContain("Administração");
  });
});
