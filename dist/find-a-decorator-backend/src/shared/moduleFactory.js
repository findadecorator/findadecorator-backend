"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildModuleController = buildModuleController;
exports.bindCrudRoutes = bindCrudRoutes;
exports.defaultEntitySchema = defaultEntitySchema;
const zod_1 = require("zod");
function buildModuleController(service, createSchema, updateSchema) {
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
function bindCrudRoutes(router, controller) {
    router.get("/", controller.list);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.patch("/:id", controller.update);
    return router;
}
function defaultEntitySchema(namespace) {
    return {
        createSchema: zod_1.z.object({
            name: zod_1.z.string().min(1),
            status: zod_1.z.string().optional(),
            metadata: zod_1.z.record(zod_1.z.any()).optional()
        }),
        updateSchema: zod_1.z.object({
            name: zod_1.z.string().min(1).optional(),
            status: zod_1.z.string().optional(),
            metadata: zod_1.z.record(zod_1.z.any()).optional()
        }),
        sample: {
            id: `${namespace}_sample`,
            name: `${namespace} item`,
            status: "active"
        }
    };
}
