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

type UpgradeErrorOptions = {
  feature: string;
  requiredPlan: "PRO" | "TEAM";
  /** current usage vs cap, e.g. { used: 1, limit: 1 } */
  usage?: { used: number; limit: number };
};

/**
 * Thrown when a user attempts to use a feature that their current
 * plan does not allow, or when they've exceeded their monthly quota.
 */
export class UpgradeRequiredError extends Error {
  readonly feature: string;
  readonly requiredPlan: "PRO" | "TEAM";
  readonly usage?: { used: number; limit: number };

  constructor(message: string, options: UpgradeErrorOptions) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "UpgradeRequiredError";
    this.feature = options.feature;
    this.requiredPlan = options.requiredPlan;
    this.usage = options.usage;
  }
}

export function isUpgradeRequiredError(
  err: unknown,
): err is UpgradeRequiredError {
  return err instanceof UpgradeRequiredError;
}
