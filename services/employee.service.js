const crypto = require("crypto");
const AppError = require("../utils/AppError");

// In-memory array acting as our database
const employees = [
  {
    id: "emp_1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    department: "Engineering",
    salary: 85000,
    createdAt: new Date("2026-01-15T08:30:00.000Z").toISOString(),
  },
  {
    id: "emp_2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    department: "Engineering",
    salary: 92000,
    createdAt: new Date("2026-02-10T09:15:00.000Z").toISOString(),
  },
  {
    id: "emp_3",
    name: "Carol White",
    email: "carol.white@example.com",
    department: "Human Resources",
    salary: 78000,
    createdAt: new Date("2026-03-01T10:00:00.000Z").toISOString(),
  },
];

const createEmployee = async (employeeData = {}) => {
  const normalizedEmail = employeeData?.email?.trim().toLowerCase();

  // Check for duplicate employee by email
  const existingEmployee = employees.find(
    (emp) => emp.email.toLowerCase() === normalizedEmail
  );

  if (existingEmployee) {
    throw new AppError("An employee with this email already exists", 409);
  }

  // Generate unique ID using crypto.randomUUID()
  const uniqueId = `emp_${crypto.randomUUID()}`;

  const newEmployee = {
    id: uniqueId,
    name: employeeData?.name?.trim(),
    email: normalizedEmail,
    department: employeeData?.department?.trim(),
    salary: employeeData?.salary,
    createdAt: new Date().toISOString(),
  };

  employees.push(newEmployee);
  return newEmployee;
};

const getAllEmployees = async () => {
  return [...employees];
};

const getEmployeeById = async (id) => {
  const employee = employees.find((emp) => emp.id === id);

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
