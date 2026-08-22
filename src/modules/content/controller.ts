import { buildModuleController } from "../../shared/moduleFactory";
import { service } from "./service";
import { createSchema, updateSchema } from "./schema";

export const controller = buildModuleController(service, createSchema, updateSchema);