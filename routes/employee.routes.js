// Route layer: Maps HTTP endpoints to controller functions
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const {
  validate,
  validateEmployeeId,
} = require("../middlewares/validate.middleware");
const { createEmployeeSchema } = require("../validators/employee.validator");

// Route: POST /employees (with request body validation)
router.post(
  "/",
  validate(createEmployeeSchema),
  employeeController.createEmployee
);

// Route: GET /employees
router.get("/", employeeController.getAllEmployees);

// Route: GET /employees/:id (with ID validation)
router.get("/:id", validateEmployeeId, employeeController.getEmployeeById);

module.exports = router;
