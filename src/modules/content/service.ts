import { createMemoryService } from "../../shared/memoryStore";
import { CreateInput, UpdateInput } from "./schema";

export const service = createMemoryService<CreateInput, UpdateInput>("content");