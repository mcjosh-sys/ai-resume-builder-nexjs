export class AppError extends Error {
  data?: unknown;
  constructor(message?: string, data?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.data = data;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      data: this.data,
      stack: this.stack,
    };
  }
}
