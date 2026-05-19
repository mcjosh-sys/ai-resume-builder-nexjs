type ErrorOptions = {
  timestamp?: Date;
  id?: string;
  severity?: "error" | "warning" | "info";
};

export class AppError extends Error {
  data?: any;
  id: string;
  timestamp: Date;
  severity: "error" | "warning" | "info";
  constructor(message?: string, data?: any, options?: ErrorOptions) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.data = data;
    this.timestamp = options?.timestamp ?? new Date();
    this.id = options?.id ?? Math.random().toString(36).substring(2, 15);
    this.severity = options?.severity ?? "error";
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp.toISOString(),
      name: this.name,
      message: this.message,
      stack: this.stack,
      data: this.data,
    };
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
