import Dexie, { type Table } from "dexie";
import type { Harness } from "./types";

class HarnessDB extends Dexie {
  harnesses!: Table<Harness, string>;
  constructor() {
    super("harness-builder");
    this.version(1).stores({ harnesses: "id, name, metadata.updatedAt" });
  }
}

export const db = new HarnessDB();

export async function saveHarness(harness: Harness): Promise<void> {
  const updated = { ...harness, metadata: { ...harness.metadata, updatedAt: new Date().toISOString() } };
  await db.harnesses.put(updated);
}

export async function loadHarness(id: string): Promise<Harness | undefined> {
  return db.harnesses.get(id);
}

export async function listHarnesses(): Promise<Harness[]> {
  return db.harnesses.orderBy("metadata.updatedAt").reverse().toArray();
}

export async function deleteHarness(id: string): Promise<void> {
  await db.harnesses.delete(id);
}

export async function exportAllAsJSON(): Promise<string> {
  const all = await db.harnesses.toArray();
  return JSON.stringify(all, null, 2);
}
