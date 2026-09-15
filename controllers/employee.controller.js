// Controller layer: Handles request parsing, response formatting, and calls service layer
const employeeService = require("../services/employee.service");
const asyncHandler = require("../utils/asyncHandler");

// POST /employees
const createEmployee = asyncHandler(async (req, res) => {
  const employeeData = req.body;
  const newEmployee = await employeeService.createEmployee(employeeData);

  return res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: newEmployee,
  });
});

// GET /employees
const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await employeeService.getAllEmployees();

  return res.status(200).json({
    success: true,
    message: "Fetched all employees successfully",
    data: employees,
  });
});

// GET /employees/:id
const getEmployeeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employee = await employeeService.getEmployeeById(id);

  return res.status(200).json({
    success: true,
    message: "Fetched employee by id successfully",
    data: employee,
  });
});

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
};
