import { Request, Response, Router } from "express";
import { z } from "zod";
import { EntityRecord, MemoryService } from "./memoryStore";

export interface ModuleController {
  list: (req: Request, res: Response) => void;
  getById: (req: Request, res: Response) => void;
  create: (req: Request, res: Response) => void;
  update: (req: Request, res: Response) => void;
}

export function buildModuleController<TCreate extends Record<string, unknown>, TUpdate extends Record<string, unknown>>(
  service: MemoryService<TCreate, TUpdate>,
  createSchema: { safeParse: (value: unknown) => any },
  updateSchema: { safeParse: (value: unknown) => any }
): ModuleController {
  return {
    list: (_req, res) => {
      res.json(service.list());
    },
    getById: (req, res) => {
      const item = service.getById(String(req.params.id));
      if (!item) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(item);
    },
    create: (req, res) => {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const item = service.create(parsed.data);
      res.status(201).json(item);
    },
    update: (req, res) => {
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const item = service.update(String(req.params.id), parsed.data);
      if (!item) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(item);
    }
  };
}

export function bindCrudRoutes(router: Router, controller: ModuleController): Router {
  router.get("/", controller.list);
  router.get("/:id", controller.getById);
  router.post("/", controller.create);
  router.patch("/:id", controller.update);
  return router;
}

export function defaultEntitySchema(namespace: string): {
  createSchema: { safeParse: (value: unknown) => any };
  updateSchema: { safeParse: (value: unknown) => any };
  sample: EntityRecord;
} {
  return {
    createSchema: z.object({
      name: z.string().min(1),
      status: z.string().optional(),
      metadata: z.record(z.any()).optional()
    }),
    updateSchema: z.object({
      name: z.string().min(1).optional(),
      status: z.string().optional(),
      metadata: z.record(z.any()).optional()
    }),
    sample: {
      id: `${namespace}_sample`,
      name: `${namespace} item`,
      status: "active"
    }
  };
}
