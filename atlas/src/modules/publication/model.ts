export type UploadBatchStatus = "draft" | "ready" | "published" | "expired";

export type UploadBatch = Readonly<{
  id: string;
  baseCommitSha: string;
  ownerAdminId: string;
  status: UploadBatchStatus;
  totalBytes: number;
  expiresAt: Date;
  createdAt: Date;
}>;

export type StagedUploadFile = Readonly<{
  batchId: string;
  destination: string;
  mimeType: string;
  size: number;
  blobSha: string | null;
}>;

export interface GitTreeEntry {
  readonly path: string;
  readonly sha: string;
  readonly type: "blob" | "tree";
}

export interface GitHubMaterialSource {
  readHead(): Promise<string>;
  readTree(commitSha: string): Promise<readonly GitTreeEntry[]>;
  readBlob(blobSha: string): Promise<Uint8Array>;
  createBlob(bytes: Uint8Array): Promise<string>;
}
