/**
 * Employee Repository Layer
 * Responsible strictly for data access and storage operations.
 * When migrating to a database (e.g. MongoDB, PostgreSQL, Prisma),
 * only this file needs to be updated.
 */

// In-memory data store acting as the database
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

/**
 * Fetch all employees from the store
 * @returns {Promise<Array>} List of employees
 */
const findAll = async () => {
  return [...employees];
};

/**
 * Find a single employee by ID
 * @param {string} id - Employee ID
 * @returns {Promise<Object|null>} Found employee or null
 */
const findById = async (id) => {
  if (!id) return null;
  const cleanId = typeof id === "string" ? id.trim() : id;
  const employee = employees.find((emp) => emp.id === cleanId);
  return employee || null;
};

/**
 * Find a single employee by email (case-insensitive)
 * @param {string} email - Employee email
 * @returns {Promise<Object|null>} Found employee or null
 */
const findByEmail = async (email) => {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  const employee = employees.find(
    (emp) => emp.email.toLowerCase() === normalized
  );
  return employee || null;
};

/**
 * Insert a new employee record into the store
 * @param {Object} employeeData - Complete employee object to save
 * @returns {Promise<Object>} Saved employee object
 */
const create = async (employeeData) => {
  employees.push(employeeData);
  return employeeData;
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
};
