/**
 * Custom Application Error Class
 * Extends JavaScript's built-in Error to support HTTP status codes and operational flags.
 */
class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);

    this.statusCode = statusCode || 500;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Distinguishes operational errors from programming bugs
    this.errors = errors; // Holds detailed validation or field errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
