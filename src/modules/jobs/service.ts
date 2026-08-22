import { z } from "zod";
import { createJobSchema, jobStatusSchema } from "./schema";

type JobStatus = z.infer<typeof jobStatusSchema>;
type CreateJobInput = z.infer<typeof createJobSchema>;

interface JobRecord extends CreateJobInput {
  id: string;
  status: JobStatus;
  duplicateOfJobId?: string;
  suspicious: boolean;
}

const jobs = new Map<string, JobRecord>();

function makeId(): string {
  return `job_${Math.random().toString(36).slice(2, 10)}`;
}

function fingerprint(input: CreateJobInput): string {
  return `${input.postcode.toLowerCase()}|${input.title.toLowerCase()}|${input.serviceType.toLowerCase()}`;
}

export function listJobs() {
  return Array.from(jobs.values());
}

export function createJob(input: CreateJobInput) {
  const fp = fingerprint(input);
  const duplicate = Array.from(jobs.values()).find((job) => fingerprint(job) === fp);
  const suspicious = /cash only|outside platform|wire transfer/i.test(`${input.title} ${input.description}`);
  const job: JobRecord = {
    id: makeId(),
    ...input,
    status: duplicate ? "review" : "submitted",
    duplicateOfJobId: duplicate?.id,
    suspicious
  };
  jobs.set(job.id, job);
  return job;
}

export function moveJobStatus(jobId: string, status: JobStatus) {
  const current = jobs.get(jobId);
  if (!current) {
    return null;
  }
  const updated = { ...current, status };
  jobs.set(jobId, updated);
  return updated;
}

