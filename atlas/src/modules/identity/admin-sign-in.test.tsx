import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("better-auth/react", () => ({
  createAuthClient: () => ({ signIn: { social: async () => ({ error: null }) }, signOut: async () => undefined }),
}));

import { ADMIN_SIGN_IN_CALLBACK_URL, AdminSignIn, startAdminGitHubSignIn } from "./admin-sign-in";

type SocialOptions = { provider: string; callbackURL: string };

function recordingClient() {
  const calls: SocialOptions[] = [];
  let signOuts = 0;
  return {
    calls,
    signOuts: () => signOuts,
    signIn: {
      social: async (options: SocialOptions): Promise<{ error?: { message?: string } | null }> => {
        calls.push(options);
        return { error: null };
      },
    },
    signOut: async () => {
      signOuts += 1;
    },
  };
}

describe("GitHub admin sign-in", () => {
  it("asks Better Auth for the GitHub flow with the entry point as the callback", async () => {
    const client = recordingClient();

    expect(await startAdminGitHubSignIn(client)).toBe(true);
    expect(client.calls).toEqual([{ provider: "github", callbackURL: ADMIN_SIGN_IN_CALLBACK_URL }]);
    expect(ADMIN_SIGN_IN_CALLBACK_URL).toBe("/admin/entrar");
  });

  it("signs the wrong account out before restarting the flow", async () => {
    const client = recordingClient();

    await startAdminGitHubSignIn(client, { replaceAccount: true });

    expect(client.signOuts()).toBe(1);
    expect(client.calls).toHaveLength(1);
  });

  it("reports failure instead of claiming success when Better Auth rejects", async () => {
    const client = recordingClient();
    client.signIn.social = async () => ({ error: { message: "denied" } });

    expect(await startAdminGitHubSignIn(client)).toBe(false);
  });

  it("renders the owner entry with the GitHub button", () => {
    const html = renderToStaticMarkup(<AdminSignIn reason="unauthenticated" />);

    expect(html).toContain("Entrar com GitHub");
    expect(html).toContain("proprietário");
  });

  it("tells a signed-in non-owner that the account is not the owner", () => {
    const html = renderToStaticMarkup(<AdminSignIn reason="not-owner" />);

    expect(html).toContain("não é o proprietário");
    expect(html).toContain("Entrar com outra conta GitHub");
  });
});
