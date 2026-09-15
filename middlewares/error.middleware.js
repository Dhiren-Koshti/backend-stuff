/**
 * Global Error Handling Middleware
 * Centralized error handler for all application errors.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  const response = {
    success: false,
    status,
    message: err.message || "Internal Server Error",
  };

  // If detailed validation errors exist, include them in the response
  if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    response.errors = err.errors;
  }

  // Optional: Uncomment during deep debugging if you need to see stack trace and raw error object
  // if (process.env.NODE_ENV === "DEV") {
  //   response.stack = err.stack;
  //   response.error = err;
  // }

  if (!err.isOperational && statusCode === 500) {
    // For non-operational/unknown server errors in production, hide implementation details
    console.error("UNEXPECTED ERROR 💥:", err);
    response.message = "Something went wrong on the server!";
  }

  return res.status(statusCode).json(response);
};

module.exports = { errorHandler };
