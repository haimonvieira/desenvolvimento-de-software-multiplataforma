import { describe, expect, it } from "vitest";

import { AdminAuthorizationError } from "./admin-authorizer";
import { resolveAdminEntry } from "./admin-entry";

describe("admin entry resolution", () => {
  it("offers GitHub sign-in to a visitor with no session, without attempting to bootstrap", async () => {
    let bootstrapped = false;
    const state = await resolveAdminEntry({
      session: async () => null,
      bootstrap: async () => {
        bootstrapped = true;
        return { adminId: "owner", created: true };
      },
    });

    expect(state).toEqual({ kind: "sign-in", reason: "unauthenticated" });
    expect(bootstrapped).toBe(false);
  });

  it("bootstrap the owner session and reports the admin surface", async () => {
    const state = await resolveAdminEntry({
      session: async () => ({ userId: "owner" }),
      bootstrap: async () => ({ adminId: "owner", created: true }),
    });

    expect(state).toEqual({ kind: "admin" });
  });

  it("keeps an already-bootstrapped owner on the admin surface without error", async () => {
    const state = await resolveAdminEntry({
      session: async () => ({ userId: "owner" }),
      bootstrap: async () => ({ adminId: "owner", created: false }),
    });

    expect(state).toEqual({ kind: "admin" });
  });

  it("refuses a session whose GitHub account is not the configured owner", async () => {
    const state = await resolveAdminEntry({
      session: async () => ({ userId: "visitor" }),
      bootstrap: async () => {
        throw new AdminAuthorizationError();
      },
    });

    expect(state).toEqual({ kind: "sign-in", reason: "not-owner" });
  });

  it("keeps infrastructure failures loud instead of downgrading them to a sign-in prompt", async () => {
    await expect(
      resolveAdminEntry({
        session: async () => ({ userId: "owner" }),
        bootstrap: async () => {
          throw new Error("database unavailable");
        },
      }),
    ).rejects.toThrow("database unavailable");
  });
});
