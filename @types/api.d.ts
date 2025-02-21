export type APIResponse<T = unknown> =
  | { status: "success"; data: T }
  | {
      status: "error";
      error: { message: string; code?: string | number; details?: unknown };
    };
