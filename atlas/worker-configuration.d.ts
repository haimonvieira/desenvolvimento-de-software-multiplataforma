declare module "cloudflare:workers" {
  export const env: {
    DATABASE_URL?: string;
    GITHUB_TOKEN?: string;
    GITHUB_REPOSITORY?: string;
    BETTER_AUTH_SECRET?: string;
    BETTER_AUTH_URL?: string;
    BETTER_AUTH_TRUSTED_ORIGINS?: string;
    PASSKEY_RP_ID?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    ADMIN_GITHUB_USER_ID?: string;
    TUTOR_SUBJECT_SECRET?: string;
    GROQ_API_KEY?: string;
    /** Administrative classifier credential; never the public GROQ_API_KEY. */
    GROQ_ADMIN_API_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    /** Public widget sitekey; safe in the client bundle, unlike the secret. */
    TURNSTILE_SITE_KEY?: string;
  };
}
