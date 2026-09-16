const crypto = require("crypto");
const AppError = require("../utils/AppError");
const employeeRepository = require("../repositories/employee.repository");

/**
 * Service Layer: Business logic, validation rules, domain orchestration.
 * Completely decoupled from storage mechanism.
 */

const createEmployee = async (employeeData = {}) => {
  const normalizedEmail = employeeData?.email?.trim().toLowerCase();

  // Business Rule: Check for duplicate employee by email
  const existingEmployee = await employeeRepository.findByEmail(normalizedEmail);
  if (existingEmployee) {
    throw new AppError("An employee with this email already exists", 409);
  }

  // Domain Logic: Generate unique employee ID and creation timestamp
  const uniqueId = `emp_${crypto.randomUUID()}`;
  const newEmployee = {
    id: uniqueId,
    name: employeeData?.name?.trim(),
    email: normalizedEmail,
    department: employeeData?.department?.trim(),
    salary: employeeData?.salary,
    createdAt: new Date().toISOString(),
  };

  // Delegate data storage to the repository
  return await employeeRepository.create(newEmployee);
};

const getAllEmployees = async () => {
  return await employeeRepository.findAll();
};

const getEmployeeById = async (id) => {
  const employee = await employeeRepository.findById(id);

  if (!employee) {
    throw new AppError(`Employee not found with ID: ${id}`, 404);
  }

  return employee;
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
};
