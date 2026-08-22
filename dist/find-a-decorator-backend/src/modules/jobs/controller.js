"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listJobsController = listJobsController;
exports.createJobController = createJobController;
exports.updateJobStatusController = updateJobStatusController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function listJobsController(_req, res) {
    res.json((0, service_1.listJobs)());
}
function createJobController(req, res) {
    const parsed = schema_1.createJobSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const job = (0, service_1.createJob)(parsed.data);
    res.status(201).json(job);
}
function updateJobStatusController(req, res) {
    const statusParsed = schema_1.jobStatusSchema.safeParse(req.body.status);
    if (!statusParsed.success) {
        res.status(400).json({ error: statusParsed.error.flatten() });
        return;
    }
    const updated = (0, service_1.moveJobStatus)(String(req.params.jobId), statusParsed.data);
    if (!updated) {
        res.status(404).json({ error: "Job not found" });
        return;
    }
    res.json(updated);
}
