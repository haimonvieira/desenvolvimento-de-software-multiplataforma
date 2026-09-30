CREATE TABLE "admin_identity" (
  "singleton" boolean PRIMARY KEY DEFAULT true NOT NULL,
  "admin_id" text NOT NULL,
  "github_user_id" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "admin_identity_admin_id_unique" UNIQUE("admin_id"),
  CONSTRAINT "admin_identity_github_user_id_unique" UNIQUE("github_user_id"),
  CONSTRAINT "admin_identity_singleton_check" CHECK ("admin_identity"."singleton" = true),
  CONSTRAINT "admin_identity_github_user_id_check" CHECK ("admin_identity"."github_user_id" ~ '^[1-9][0-9]*$')
);
--> statement-breakpoint
ALTER TABLE "admin_identity" ADD CONSTRAINT "admin_identity_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "admin_audit_event" (
  "id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "admin_id" text NOT NULL,
  "action" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "admin_audit_event_action_check" CHECK ("admin_audit_event"."action" in ('admin.bootstrap', 'admin.passkey.add', 'admin.batch.publish', 'admin.recovery'))
);
--> statement-breakpoint
ALTER TABLE "admin_audit_event" ADD CONSTRAINT "admin_audit_event_admin_id_admin_identity_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_identity"("admin_id") ON DELETE restrict ON UPDATE no action;
