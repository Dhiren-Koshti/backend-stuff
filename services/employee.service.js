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
  const existingEmployee = await employeeRepository.findByEmail(
    normalizedEmail
  );
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

const updateEmployee = async (id, updateData = {}) => {
  // 1. Verify that the employee exists
  const existingEmployee = await employeeRepository.findById(id);
  if (!existingEmployee) {
    throw new AppError(`Employee not found with ID: ${id}`, 404);
  }

  // 2. Prepare fields to update
  const sanitizedUpdates = {};

  if (updateData.name !== undefined) {
    sanitizedUpdates.name = updateData.name.trim();
  }

  if (updateData.department !== undefined) {
    sanitizedUpdates.department = updateData.department.trim();
  }

  if (updateData.salary !== undefined) {
    sanitizedUpdates.salary = updateData.salary;
  }

  // 3. If email is being updated, verify uniqueness across other employees
  if (updateData.email !== undefined) {
    const normalizedEmail = updateData.email.trim().toLowerCase();

    // Only check conflict if it differs from current email
    if (normalizedEmail !== existingEmployee.email.toLowerCase()) {
      const emailInUse = await employeeRepository.findByEmail(normalizedEmail);
      if (emailInUse && emailInUse.id !== existingEmployee.id) {
        throw new AppError("An employee with this email already exists", 409);
      }
    }

    sanitizedUpdates.email = normalizedEmail;
  }

  // 4. Attach updatedAt timestamp
  sanitizedUpdates.updatedAt = new Date().toISOString();

  // 5. Delegate update to repository
  return await employeeRepository.update(id, sanitizedUpdates);
};

const deleteEmployee = async (id) => {
  // 1. Verify that the employee exists
  const existingEmployee = await employeeRepository.findById(id);
  if (!existingEmployee) {
    throw new AppError(`Employee not found with ID: ${id}`, 404);
  }

  // 2. Delegate deletion to repository
  return await employeeRepository.deleteById(id);
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
