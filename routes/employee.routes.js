// Route layer: Maps HTTP endpoints to controller functions
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const {
  validate,
  validateEmployeeId,
} = require("../middlewares/validate.middleware");
const {
  createEmployeeSchema,
  updateEmployeeSchema,
} = require("../validators/employee.validator");

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

// Route: PATCH /employees/:id (with ID and partial body validation)
router.patch(
  "/:id",
  validateEmployeeId,
  validate(updateEmployeeSchema),
  employeeController.updateEmployee
);

// Route: DELETE /employees/:id (with ID validation)
router.delete("/:id", validateEmployeeId, employeeController.deleteEmployee);

module.exports = router;
