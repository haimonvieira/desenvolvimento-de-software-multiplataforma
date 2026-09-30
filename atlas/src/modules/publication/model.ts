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

export type TreeEntryInput = Readonly<{
  path: string;
  mode: "100644";
  type: "blob";
  sha: string;
}>;

export type GitCommitResult = Readonly<{ sha: string; url: string }>;

export interface GitHubMaterialSource {
  readHead(): Promise<string>;
  readTree(commitSha: string): Promise<readonly GitTreeEntry[]>;
  readTreeSha(commitSha: string): Promise<string>;
  readBlob(blobSha: string): Promise<Uint8Array>;
  createBlob(bytes: Uint8Array): Promise<string>;
  createTree(
    entries: readonly TreeEntryInput[],
    baseTreeSha: string,
  ): Promise<string>;
  createCommit(
    input: Readonly<{
      message: string;
      treeSha: string;
      parents: readonly string[];
    }>,
  ): Promise<GitCommitResult>;
  readRef(ref: string): Promise<string>;
  updateRef(ref: string, sha: string): Promise<boolean>;
}
