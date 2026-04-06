export class ResponseError extends Error {
  type: ErrorType;
  status?: number;

  constructor(message: string, type: ErrorType, status?: number) {
    super(message);
    this.type = type;
    this.status = status;
  }
}
