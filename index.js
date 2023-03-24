const inquirer = require('inquirer');
const cTable = require('console.table');

const { viewAllEmployees, viewDepartments, viewAllRoles, queries} = require('./queries/query.js');
const { mysqlLogin } = require('./connect.js');

//stores the login info for mysql, found in init function
let db;

//Connects to the connect.js file that stores the inquirer process to login to mysql
async function init () {
    try {
    //Makes sure db gets login info before moving on to the menu
    db = await mysqlLogin();
    mainMenu();
    } catch (err) {
        console.log(err);
    }
}

//This is the Main Menu for inquirer which has all the options who will then branch out into their respective functions.
function mainMenu () {
    inquirer
    .prompt ([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'menuOption',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        },
    ]).then((data) => {
        // Takes one of the choices the user chose, and selects the corresponding case that matches.
        switch (data.menuOption) {

            //VIEW ALL EMPLOYEES //
            case 'View All Employees':
                db.query(viewAllEmployees, (err, res) => {
                    if (err) {
                        console.log('Error, unable to display all employees');
                        mainMenu();
                    } else {
                        displayTable(res);
                    };
                })
                break;

            // ADD EMPLOYEE //    
            case 'Add Employee':


                db.query(queries.departmentList, (err, results) => {
                    if (err) throw err;

                    const depList = results.map(results => results.name);

                    db.query(queries.fullName, (err, results) => {

                        const managerName = results.map(results => `${results.first_name} ${results.last_name}`);

                        if(!managerName.includes('none')) {
                            managerName.push('none');                        
                        }

                inquirer
                .prompt ([
                    {
                        type: 'input',
                        message: 'What is the employees first name?',
                        name: 'firstName'
                    },
                    {
                        type: 'input',
                        message: 'What is the employees last name',
                        name: 'lastName'
                    },
                    {
                        type: 'list',
                        message: 'What is the Employees Role?',
                        name: 'empRole',
                        choices: depList,
                    },
                    {
                        type: 'list',
                        message: 'Who is this employees Manager?',
                        name: 'manager',
                        choices: managerName
                    }
                    
                ]).then((data) => {

                    const name = data.manager.split(" ");
                    const managerName = [name[0], name[1]];

                    db.query(queries.idDepartmentWhereRole, data.empRole, (err, results) => {

                        const deptId = results;
                        const insertValues = [data.firstName, data.lastName, deptId[0].id];

                        if (data.manager !== 'none') {
                        db.query(queries.idRoleFullName, managerName, (err, results) => {
                            insertValues.push(results[0].id);
                            db.query(queries.insertEmployee, insertValues);
                            mainMenu();
                        })
                        } else {
                            insertValues.push(null);
                            db.query(queries.insertEmployee, insertValues);
                            mainMenu();
                        } 
                    })
                })
            })
            })
                break;

            //UPDATE EMPLOYEE ROLE
            case 'Update Employee Role':

            db.query(queries.fullName, (err, results) => { 

                const employeeList = results.map(results => `${results.first_name} ${results.last_name}`);

                db.query(queries.roleTitle, (err, results) => {

                    const roleList = results.map(results => `${results.title}`)

                    inquirer
                    .prompt([
                        {
                            type: 'list',
                            message: `Which Employee would you like to update?`,
                            name: 'employee',
                            choices: employeeList
                        },
                        {
                            type: 'list',
                            message: 'What role would you like to assign?',
                            name: 'role',
                            choices: roleList
                        }
                        ]).then((data) => {    

                            db.query(queries.roleId, data.role, (err, results) => {
                                console.log(results);

                                const name = data.employee.split(" ");
                                const employeeRoleAndName = [results[0].id, name[0], name[1]];

                                db.query(queries.updateRole, employeeRoleAndName);
                                mainMenu();
                            })
                        })
                })
            })

                break;

            //VIEW ALL ROLES
            case 'View All Roles':
                db.query(viewAllRoles, (err, res) => {
                    if (err) {
                        console.log(err);
                        mainMenu();
                    } else {
                        displayTable(res);
                    };
                })
                break;

            //ADD ROLES
            case 'Add Role':
                db.query(queries.departmentList, (err, results) => {
                    const depList = results.map(results => results.name);                
                inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'Name of the Role?',
                        name: 'roleName'
                    },
                    {
                        type: 'input',
                        message: 'What is the roles salary',
                        name: 'roleSalary'
                    },
                    {
                        type: 'list',
                        message: 'What department does this role belong to?',
                        name: 'roleDept',
                        choices: depList,
                    },
                ]).then((data) => {
                    
                    const salary = parseInt(data.roleSalary)
                    db.query(queries.idDepartmentWhereRole, data.roleDept, (err, results) => {
                    const role = [data.roleName, salary , results[0].id];
                    db.query(queries.insertRole, role, (err, res) => {
                        console.log('Role Added Succesfully!');
                        mainMenu();
                    })
                    })
                })
                })
                break;

            //VIEW ALL DEPARTMENTS
            case 'View All Departments':
                db.query(viewDepartments, (err, res) => {
                    if (err) {
                        console.log('Error, unable to display departments');
                        mainMenu();
                    } else {
                        displayTable(res);
                    }
                })
                break;

            //ADDS DEPARTMENT
            case 'Add Department':
                inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'What is the Department name?',
                        name: 'department'
                    }
                ]).then((data) => {

                    db.query(queries.insertDepartment, data.department.trim(), (err) => {
                        if (err) {
                        console.log('error has occured');
                        mainMenu();
                        } else {
                        console.log('Department added successfully!');
                        mainMenu();
                        }
                    })
                })
                break;

            //EXIT OUT OF SESSION
            case 'Quit':
                console.log('Now Exiting...');
                process.exit();
        }
    });
};

// Divides up the 
function displayTable(table) {
    const divider = [];
    for(let i = 0; i < 100; i++) {
        divider.push('=');
    }
    console.log(`\n${divider.join('')}\n`);
    console.table(table);
    console.log(`\n${divider.join('')}\n`);
    mainMenu();
};

init();