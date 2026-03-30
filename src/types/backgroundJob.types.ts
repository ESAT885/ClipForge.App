export class BackgroundJobStatusResponse {
  queueCount?: number;
  active?: BackgroundJob[];
  completed?: BackgroundJob[];
  failed?: BackgroundJob[];
}
// JobStatus enum
export enum JobStatus {
  Queued = 0,
  Running = 1,
  Completed = 2,
  Failed = 3
}

// BackgroundJob interface
export interface BackgroundJob {
  id: string; // Guid -> string
  name: string;
  status: JobStatus;
  retryCount: number;
  maxRetry: number;
  createdAt: string; // DateTime -> ISO string
  startedAt?: string; // Nullable DateTime
  finishedAt?: string; // Nullable DateTime
  executionDurationSeconds?: number; // TotalSeconds equivalent
}
