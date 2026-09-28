import { z } from "zod";

const material = z.object({ path: z.string().min(1).max(500), commitSha: z.string().min(1).max(160) });
const timestamp = z.iso.datetime({ offset: true });
const record = z.object({ id: z.string().min(1).max(160), updatedAt: timestamp, deletedAt: timestamp.nullable() });
const note = record.extend({ material, text: z.string().max(20_000) });
const flashcard = record.extend({ material, front: z.string().max(2_000), back: z.string().max(10_000) });
const change = z.discriminatedUnion("type", [
  z.object({ type: z.literal("progress.set"), material, status: z.enum(["new", "studying", "done"]), at: timestamp }),
  z.object({ type: z.literal("favorite.set"), material, value: z.boolean(), at: timestamp }),
  z.object({ type: z.literal("note.save"), note }),
  z.object({ type: z.literal("flashcard.save"), flashcard }),
  z.object({ type: z.literal("item.delete"), entity: z.enum(["note", "flashcard"]), id: z.string().min(1).max(160), at: timestamp }),
]);

export const syncRequestSchema = z.object({
  deviceId: z.string().uuid(),
  cursor: z.string().regex(/^\d+$/),
  outbox: z.array(record.extend({ change })).max(500),
}).strict();
