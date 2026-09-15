/**
 * Employee Validation Schemas
 * Defines allowed fields, required fields, and specific validation rules for employee endpoints.
 */

// Email regex pattern following standard email format
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reasonable name regex: letters, spaces, hyphens, periods, and apostrophes (min 2, max 50 chars)
const NAME_REGEX = /^[a-zA-Z\s.'-]{2,50}$/;

const createEmployeeSchema = {
  allowedFields: ["name", "email", "department", "salary"],
  requiredFields: ["name", "email", "department", "salary"],
  fieldRules: {
    name: {
      type: "string",
      validate: (val) => {
        const trimmed = val.trim();
        if (trimmed.length === 0) {
          return {
            valid: false,
            message: "Name cannot be empty or only whitespace",
            expected:
              "A non-empty string containing 2 to 50 alphabetic characters",
          };
        }
        if (!NAME_REGEX.test(trimmed)) {
          return {
            valid: false,
            message:
              "Name contains invalid characters or does not meet the length requirement (2-50 characters)",
            expected:
              "Only letters, spaces, hyphens, periods, or apostrophes (2 to 50 characters)",
          };
        }
        return { valid: true };
      },
    },

    email: {
      type: "string",
      validate: (val) => {
        const trimmed = val.trim();
        if (trimmed.length === 0) {
          return {
            valid: false,
            message: "Email cannot be empty",
            expected: "A valid email address (e.g. user@example.com)",
          };
        }
        if (!EMAIL_REGEX.test(trimmed)) {
          return {
            valid: false,
            message: "Invalid email format",
            expected: "A valid email address format (e.g. user@example.com)",
          };
        }
        return { valid: true };
      },
    },

    department: {
      type: "string",
      validate: (val) => {
        const trimmed = val.trim();
        if (trimmed.length === 0) {
          return {
            valid: false,
            message: "Department cannot be empty or only whitespace",
            expected: "A non-empty string with at least 2 characters",
          };
        }
        if (trimmed.length < 2 || trimmed.length > 50) {
          return {
            valid: false,
            message: "Department length must be between 2 and 50 characters",
            expected: "A string between 2 and 50 characters",
          };
        }
        return { valid: true };
      },
    },

    salary: {
      type: "number",
      validate: (val) => {
        if (!Number.isFinite(val)) {
          return {
            valid: false,
            message: "Salary must be a valid finite number",
            expected: "A finite number",
          };
        }
        if (val <= 0) {
          return {
            valid: false,
            message: "Salary must be a positive number greater than 0",
            expected: "A positive number > 0 (cannot be zero or negative)",
          };
        }
        return { valid: true };
      },
    },
  },
};

module.exports = {
  createEmployeeSchema,
};
