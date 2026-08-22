export interface EntityRecord {
  id: string;
  [key: string]: unknown;
}

export interface MemoryService<TCreate extends Record<string, unknown>, TUpdate extends Record<string, unknown>> {
  list: () => EntityRecord[];
  getById: (id: string) => EntityRecord | null;
  create: (input: TCreate) => EntityRecord;
  update: (id: string, input: TUpdate) => EntityRecord | null;
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createMemoryService<TCreate extends Record<string, unknown>, TUpdate extends Record<string, unknown>>(
  namespace: string
): MemoryService<TCreate, TUpdate> {
  const records = new Map<string, EntityRecord>();

  return {
    list: () => Array.from(records.values()),
    getById: (id: string) => records.get(id) ?? null,
    create: (input: TCreate) => {
      const id = makeId(namespace);
      const record: EntityRecord = {
        id,
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      records.set(id, record);
      return record;
    },
    update: (id: string, input: TUpdate) => {
      const existing = records.get(id);
      if (!existing) {
        return null;
      }
      const updated = {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString()
      };
      records.set(id, updated);
      return updated;
    }
  };
}

