/**
 * Global Error Handling Middleware
 * Centralized error handler for all application errors.
 */
const errorHandler = (err, req, res, next) => {
  // Handle Express body-parser malformed JSON syntax errors gracefully
  if (err instanceof SyntaxError && (err.status === 400 || err.statusCode === 400) && "body" in err) {
    return res.status(400).json({
      success: false,
      status: "fail",
      message: "Malformed JSON payload in request body",
    });
  }

  const statusCode = err.statusCode || (typeof err.status === "number" ? err.status : 500);
  const status = typeof err.status === "string" ? err.status : `${statusCode}`.startsWith("4") ? "fail" : "error";

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
