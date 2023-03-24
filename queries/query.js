//All the queries needed for each function//

// View All Queries
const viewAllEmployees = `SELECT  
e1.id,
e1.first_name,
e1.last_name,
role.title,
department.name AS department,
role.salary,
CONCAT(e2.first_name, " ", e2.last_name) AS manager
FROM employee e1
LEFT JOIN employee e2 ON e2.id = e1.manager_id
JOIN role ON role.id = e1.role_id
JOIN department ON department.id = role.department_id
ORDER BY e1.id;`

const viewDepartments = `SELECT
department.id AS department_id,
department.name AS department_name
FROM department
ORDER BY department.id;`

const viewAllRoles = `SELECT
role.id AS id,
role.title AS title,
department.name AS department,
role.salary as salary
FROM role
JOIN department ON department.id = role.department_id
ORDER BY id;`

// Select Queries

const queries = {
    // Selects
    departmentList: 'SELECT name FROM department;',
    roleTitle: 'SELECT title FROM role;',
    fullName: 'SELECT first_name, last_name FROM employee;',
    idDepartmentWhereRole: 'SELECT id FROM department WHERE name = ?',
    roleId: 'SELECT id FROM role WHERE title = ?',
    roleTitle: 'SELECT title FROM role;',
    idRoleFullName: 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?',
    // Inserts
    insertEmployee: 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);',
    insertRole: 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);',
    insertDepartment: 'INSERT INTO department (name) VALUES ( ? );',
    // Updates
    updateRole: 'Update employee SET role_id = ? WHERE first_name = ? AND last_name = ?'
}

module.exports = {
    viewAllEmployees,
    viewDepartments,
    viewAllRoles,
    queries
}