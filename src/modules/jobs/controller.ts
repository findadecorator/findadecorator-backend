import { Request, Response } from "express";
import { createJobSchema, jobStatusSchema } from "./schema";
import { createJob, listJobs, moveJobStatus } from "./service";

export function listJobsController(_req: Request, res: Response) {
  res.json(listJobs());
}

export function createJobController(req: Request, res: Response) {
  const parsed = createJobSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const job = createJob(parsed.data);
  res.status(201).json(job);
}

export function updateJobStatusController(req: Request, res: Response) {
  const statusParsed = jobStatusSchema.safeParse(req.body.status);
  if (!statusParsed.success) {
    res.status(400).json({ error: statusParsed.error.flatten() });
    return;
  }
  const updated = moveJobStatus(String(req.params.jobId), statusParsed.data);
  if (!updated) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(updated);
}
