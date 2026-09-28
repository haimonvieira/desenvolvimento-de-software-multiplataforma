import {
  bigint,
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  ...timestamps,
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    uniqueIndex("account_provider_account_uidx").on(table.providerId, table.accountId),
  ],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const rateLimit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

export const passkey = pgTable(
  "passkey",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    publicKey: text("public_key").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    credentialID: text("credential_id").notNull().unique(),
    counter: integer("counter").notNull(),
    deviceType: text("device_type").notNull(),
    backedUp: boolean("backed_up").notNull(),
    transports: text("transports"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    aaguid: text("aaguid"),
  },
  (table) => [index("passkey_user_id_idx").on(table.userId)],
);

export const studyProfile = pgTable("study_profile", {
  id: text("id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const materialFields = {
  materialPath: text("material_path").notNull(),
  materialCommitSha: text("material_commit_sha").notNull(),
};

export const studyProgress = pgTable(
  "study_progress",
  {
    id: text("id").notNull(),
    profileId: text("profile_id").notNull().references(() => studyProfile.id, { onDelete: "cascade" }),
    ...materialFields,
    status: text("status").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    syncDeviceId: text("sync_device_id").notNull().default(""),
    syncOperationId: text("sync_operation_id").notNull().default(""),
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.id] }),
    uniqueIndex("study_progress_profile_material_uidx").on(table.profileId, table.materialPath, table.materialCommitSha),
    check("study_progress_status_check", sql`${table.status} in ('new', 'studying', 'done')`),
  ],
);

export const favorite = pgTable(
  "favorite",
  {
    id: text("id").notNull(),
    profileId: text("profile_id").notNull().references(() => studyProfile.id, { onDelete: "cascade" }),
    ...materialFields,
    value: boolean("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    syncDeviceId: text("sync_device_id").notNull().default(""),
    syncOperationId: text("sync_operation_id").notNull().default(""),
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.id] }),
    uniqueIndex("favorite_profile_material_uidx").on(table.profileId, table.materialPath, table.materialCommitSha),
  ],
);

export const note = pgTable(
  "note",
  {
    id: text("id").notNull(),
    profileId: text("profile_id").notNull().references(() => studyProfile.id, { onDelete: "cascade" }),
    ...materialFields,
    text: text("text").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    syncDeviceId: text("sync_device_id").notNull().default(""),
    syncOperationId: text("sync_operation_id").notNull().default(""),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.id] }), index("note_profile_id_idx").on(table.profileId)],
);

export const flashcard = pgTable(
  "flashcard",
  {
    id: text("id").notNull(),
    profileId: text("profile_id").notNull().references(() => studyProfile.id, { onDelete: "cascade" }),
    ...materialFields,
    front: text("front").notNull(),
    back: text("back").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    syncDeviceId: text("sync_device_id").notNull().default(""),
    syncOperationId: text("sync_operation_id").notNull().default(""),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.id] }), index("flashcard_profile_id_idx").on(table.profileId)],
);

export const syncCursor = pgTable(
  "sync_cursor",
  {
    profileId: text("profile_id").notNull().references(() => studyProfile.id, { onDelete: "cascade" }),
    deviceId: text("device_id").notNull(),
    cursor: text("cursor").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.deviceId] })],
);

export const syncOperation = pgTable(
  "sync_operation",
  {
    sequence: bigint("sequence", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    profileId: text("profile_id").notNull().references(() => studyProfile.id, { onDelete: "cascade" }),
    operationId: text("operation_id").notNull(),
    deviceId: text("device_id").notNull(),
    change: text("change").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("sync_operation_profile_operation_uidx").on(table.profileId, table.operationId)],
);

export const noteConflict = pgTable(
  "note_conflict",
  {
    id: text("id").notNull(),
    profileId: text("profile_id").notNull().references(() => studyProfile.id, { onDelete: "cascade" }),
    noteId: text("note_id").notNull(),
    versions: text("versions").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.id] }), index("note_conflict_profile_id_idx").on(table.profileId)],
);

export const syncRequest = pgTable("sync_request", {
  profileId: text("profile_id").notNull().references(() => studyProfile.id, { onDelete: "cascade" }),
  deviceId: text("device_id").notNull(),
  requestId: text("request_id").notNull(),
  bodyHash: text("body_hash").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.profileId, table.deviceId, table.requestId] })]);

export const profileDeletionProof = pgTable("profile_deletion_proof", {
  tokenHash: text("token_hash").primaryKey(),
  profileId: text("profile_id").notNull().references(() => studyProfile.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  challengeHash: text("challenge_hash").notNull(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
}, (table) => [uniqueIndex("profile_deletion_proof_profile_uidx").on(table.profileId)]);

export const adminIdentity = pgTable("admin_identity", {
  singleton: boolean("singleton").primaryKey().default(true),
  adminId: text("admin_id").notNull().unique().references(() => user.id, { onDelete: "restrict" }),
  githubUserId: text("github_user_id").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [check("admin_identity_singleton_check", sql`${table.singleton} = true`), check("admin_identity_github_user_id_check", sql`${table.githubUserId} ~ '^[1-9][0-9]*$'`)]);

export const adminAuditEvent = pgTable("admin_audit_event", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  adminId: text("admin_id").notNull().references(() => adminIdentity.adminId, { onDelete: "restrict" }),
  action: text("action").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [check("admin_audit_event_action_check", sql`${table.action} in ('admin.bootstrap', 'admin.passkey.add', 'admin.batch.publish', 'admin.recovery')`)]);

export const uploadBatch = pgTable("upload_batch", {
  id: text("id").primaryKey(),
  baseCommitSha: text("base_commit_sha").notNull(),
  ownerAdminId: text("owner_admin_id").notNull().references(() => adminIdentity.adminId, { onDelete: "restrict" }),
  status: text("status").notNull(),
  totalBytes: integer("total_bytes").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  publishedCommitSha: text("published_commit_sha"),
  publishedCommitUrl: text("published_commit_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (table) => [check("upload_batch_status_check", sql`${table.status} in ('draft', 'ready', 'published', 'expired')`)]);

export const stagedUploadFile = pgTable("staged_upload_file", {
  batchId: text("batch_id").notNull().references(() => uploadBatch.id, { onDelete: "cascade" }),
  destination: text("destination").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  blobSha: text("blob_sha"),
}, (table) => [primaryKey({ columns: [table.batchId, table.destination] })]);

export const aiUsageWindow = pgTable("ai_usage_window", {
  scope: text("scope").notNull(),
  subjectKey: text("subject_key").notNull(),
  windowKind: text("window_kind").notNull(),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
  requests: integer("requests").notNull().default(0),
  reservedInputTokens: bigint("reserved_input_tokens", { mode: "number" }).notNull().default(0),
  reservedOutputTokens: bigint("reserved_output_tokens", { mode: "number" }).notNull().default(0),
  inputTokens: bigint("input_tokens", { mode: "number" }).notNull().default(0),
  outputTokens: bigint("output_tokens", { mode: "number" }).notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.scope, table.subjectKey, table.windowKind, table.windowStart] }),
  check("ai_usage_window_scope_check", sql`${table.scope} in ('public', 'admin')`),
  check("ai_usage_window_kind_check", sql`${table.windowKind} in ('hour', 'day', 'global')`),
  check("ai_usage_window_global_subject_check", sql`(${table.windowKind} = 'global') = (${table.subjectKey} = '*')`),
]);

export const aiReservation = pgTable("ai_reservation", {
  id: text("id").primaryKey(),
  scope: text("scope").notNull(),
  subjectKey: text("subject_key").notNull(),
  status: text("status").notNull(),
  maxInputTokens: integer("max_input_tokens").notNull(),
  maxOutputTokens: integer("max_output_tokens").notNull(),
  maxToolCalls: integer("max_tool_calls").notNull(),
  actualInputTokens: bigint("actual_input_tokens", { mode: "number" }),
  actualOutputTokens: bigint("actual_output_tokens", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  settledAt: timestamp("settled_at", { withTimezone: true }),
}, (table) => [
  index("ai_reservation_scope_subject_idx").on(table.scope, table.subjectKey),
  index("ai_reservation_expiry_idx").on(table.status, table.expiresAt),
  check("ai_reservation_scope_check", sql`${table.scope} in ('public', 'admin')`),
  check("ai_reservation_status_check", sql`${table.status} in ('reserved', 'settled', 'unknown', 'expired')`),
]);

export const authSchema = { user, session, account, verification, rateLimit, passkey };
