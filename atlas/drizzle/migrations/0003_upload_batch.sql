CREATE TABLE "upload_batch" (
  "id" text PRIMARY KEY NOT NULL,
  "base_commit_sha" text NOT NULL,
  "owner_admin_id" text NOT NULL,
  "status" text NOT NULL,
  "total_bytes" integer NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "upload_batch_status_check" CHECK ("upload_batch"."status" in ('draft', 'ready', 'published', 'expired'))
);
--> statement-breakpoint
ALTER TABLE "upload_batch" ADD CONSTRAINT "upload_batch_owner_admin_id_admin_identity_admin_id_fk" FOREIGN KEY ("owner_admin_id") REFERENCES "public"."admin_identity"("admin_id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "staged_upload_file" (
  "batch_id" text NOT NULL,
  "destination" text NOT NULL,
  "mime_type" text NOT NULL,
  "size" integer NOT NULL,
  "blob_sha" text,
  CONSTRAINT "staged_upload_file_batch_id_destination_pk" PRIMARY KEY("batch_id","destination")
);
--> statement-breakpoint
ALTER TABLE "staged_upload_file" ADD CONSTRAINT "staged_upload_file_batch_id_upload_batch_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."upload_batch"("id") ON DELETE cascade ON UPDATE no action;
