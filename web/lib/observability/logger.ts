export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function logInfo(event: string, data: Record<string, unknown> = {}) {
  console.info(JSON.stringify({ level: 'info', event, data, ts: new Date().toISOString() }));
}

export function logError(event: string, error: unknown, data: Record<string, unknown> = {}) {
  const err = error instanceof Error ? error.message : String(error);
  console.error(JSON.stringify({ level: 'error', event, err, data, ts: new Date().toISOString() }));
}

export function auditLog(action: string, data: Record<string, unknown> = {}) {
  console.info(JSON.stringify({ level: 'audit', action, data, ts: new Date().toISOString() }));
}
