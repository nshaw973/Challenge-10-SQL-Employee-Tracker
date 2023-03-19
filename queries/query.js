//All the queries needed for each function//

const viewAllEmployees = `SELECT  
employee.id,
employee.first_name,
employee.last_name,
role.title,
department.name AS department,
role.salary,
employee.manager_id AS manager
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.department_id = role_id
ORDER BY employee.id;`

module.exports = {
    viewAllEmployees
}