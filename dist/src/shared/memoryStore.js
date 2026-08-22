"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMemoryService = createMemoryService;
function makeId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function createMemoryService(namespace) {
    const records = new Map();
    return {
        list: () => Array.from(records.values()),
        getById: (id) => records.get(id) ?? null,
        create: (input) => {
            const id = makeId(namespace);
            const record = {
                id,
                ...input,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            records.set(id, record);
            return record;
        },
        update: (id, input) => {
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
