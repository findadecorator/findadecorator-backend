"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listJobs = listJobs;
exports.createJob = createJob;
exports.moveJobStatus = moveJobStatus;
const jobs = new Map();
function makeId() {
    return `job_${Math.random().toString(36).slice(2, 10)}`;
}
function fingerprint(input) {
    return `${input.postcode.toLowerCase()}|${input.title.toLowerCase()}|${input.serviceType.toLowerCase()}`;
}
function listJobs() {
    return Array.from(jobs.values());
}
function createJob(input) {
    const fp = fingerprint(input);
    const duplicate = Array.from(jobs.values()).find((job) => fingerprint(job) === fp);
    const suspicious = /cash only|outside platform|wire transfer/i.test(`${input.title} ${input.description}`);
    const job = {
        id: makeId(),
        ...input,
        status: duplicate ? "review" : "submitted",
        duplicateOfJobId: duplicate?.id,
        suspicious
    };
    jobs.set(job.id, job);
    return job;
}
function moveJobStatus(jobId, status) {
    const current = jobs.get(jobId);
    if (!current) {
        return null;
    }
    const updated = { ...current, status };
    jobs.set(jobId, updated);
    return updated;
}
