declare module "cloudflare:workers" {
  export const env: {
    DATABASE_URL?: string;
    GITHUB_TOKEN?: string;
    GITHUB_REPOSITORY?: string;
  };
}
