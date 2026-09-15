const AppError = require("../utils/AppError");

/**
 * Generic Request Body Validation Middleware
 * Validates req.body against a provided schema definition.
 * Passes structured validation errors to the global error handler via AppError.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];
    const body = req.body;

    // 1. Validate request body presence and type
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return next(
        new AppError("Invalid request body", 400, [
          {
            field: "body",
            message: "Request body must be a valid JSON object",
            expected: "A non-empty JSON object",
          },
        ])
      );
    }

    const bodyKeys = Object.keys(body);

    // 2. Reject empty body {}
    if (bodyKeys.length === 0) {
      return next(
        new AppError("Request body cannot be empty", 400, [
          {
            field: "body",
            message: "Request body is empty",
            expected: `A JSON object containing: ${schema.requiredFields.join(", ")}`,
          },
        ])
      );
    }

    // 3. Reject unknown / extra fields
    if (schema.allowedFields && Array.isArray(schema.allowedFields)) {
      for (const key of bodyKeys) {
        if (!schema.allowedFields.includes(key)) {
          errors.push({
            field: key,
            message: `Unknown field '${key}' is not allowed`,
            expected: `Only allowed fields: ${schema.allowedFields.join(", ")}`,
          });
        }
      }
    }

    // 4. Validate required fields
    if (schema.requiredFields && Array.isArray(schema.requiredFields)) {
      for (const field of schema.requiredFields) {
        if (body[field] === undefined || body[field] === null) {
          errors.push({
            field,
            message: `'${field}' is required and cannot be null or undefined`,
            expected: `${schema.fieldRules?.[field]?.type || "value"}`,
          });
        }
      }
    }

    // 5. Data type and value validation for present fields
    if (schema.fieldRules) {
      for (const [field, rules] of Object.entries(schema.fieldRules)) {
        const value = body[field];

        // Skip if value is not provided (required field checks already handle missing fields)
        if (value === undefined || value === null) {
          continue;
        }

        // Type check
        if (rules.type) {
          const actualType = Array.isArray(value) ? "array" : typeof value;
          if (actualType !== rules.type) {
            errors.push({
              field,
              message: `'${field}' must be of type ${rules.type}, but received ${actualType}`,
              expected: rules.type,
            });
            continue; // Skip value check if type check fails
          }
        }

        // Value check
        if (typeof rules.validate === "function") {
          const result = rules.validate(value);
          if (result && !result.valid) {
            errors.push({
              field,
              message: result.message || `Invalid value for '${field}'`,
              expected: result.expected || "Valid format",
            });
          }
        }
      }
    }

    // If there are any validation errors, forward to global error handler
    if (errors.length > 0) {
      return next(new AppError("Validation failed", 400, errors));
    }

    next();
  };
};

/**
 * Simple Employee ID validation middleware
 * Validates presence and 'emp_' structure without exposing internal format details.
 */
const validateEmployeeId = (req, res, next) => {
  const { id } = req.params;

  if (
    !id ||
    typeof id !== "string" ||
    !id.trim().startsWith("emp_") ||
    id.trim().slice(4).trim().length === 0
  ) {
    return next(new AppError("Invalid employee ID", 400));
  }

  next();
};

module.exports = {
  validate,
  validateEmployeeId,
};
