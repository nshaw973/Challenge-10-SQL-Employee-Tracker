const inquirer = require('inquirer');
const mysql = require('mysql2');
const { viewAllEmployees, viewDepartments, viewAllRoles} = require('./queries/query.js')
const cTable = require('console.table');

//Stores the current username and password being used by the user, to connect to mysql and the database.
let db;

//Inquirer function to ask the user for the username and password to login into mysql
function mysqlLogin () {
inquirer
    .prompt ([
        {
            type: 'input',
            message: 'MYSQL Username',
            name: 'username'
        },
        {
            type: 'password',
            message: 'Enter Password',
            name: 'password'
        },
    ]).then((data) => {

        db = mysql.createConnection(
            {
            host: 'localhost',
            user: `${data.username}`,
            password: `${data.password}`,
            database: 'company_db',
            },
        );

        db.connect((err) => {
            if(err) {
                console.log('Error with login, please check username or password.')
                process.exit(1);
            } else {
            console.log('Connected to database...');
            mainMenu()
            }
        })
    })
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
        switch (data.menuOption) {

            //VIEW ALL EMPLOYEES
            case 'View All Employees':
                db.query(viewAllEmployees, (err, res) => {
                    if (err) {
                        console.log('Error, unable to display all employees')
                        mainMenu();
                    } else {
                    spaceDivider();
                    console.table(res)
                    spaceDivider();
                    mainMenu();
                    }
                })
                break;
            case 'Add Employee':
                
                const departList = 'SELECT name FROM department;';
                const empManager = 'SELECT first_name, last_name FROM employee;';

                db.query(departList, (err, results) => {
                    if (err) throw err;
                    const depList = results.map(results => results.name);

                    db.query(empManager, (err, results) => {

                        const managerName = results.map(results => `${results.first_name} ${results.last_name}`)

                        if(!managerName.includes('none')) {
                            managerName.push('none')                          
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
                    const firstName = name[0];
                    const lastName = name[1];
                    let employee;

                    db.query(`SELECT id FROM department WHERE name = '${data.empRole}';`, (err, results) => {

                        const deptId = results;

                        if (data.manager !== 'none') {
                        db.query(`SELECT id FROM employee WHERE first_name = '${firstName}' AND last_name = '${lastName}';`, (err, results) => {

                            employee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", ${deptId[0].id}, ${results[0].id});`
                            db.query(employee)
                            mainMenu();
                        })
                        } else {
                            employee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.firstName}", "${data.lastName}", ${deptId[0].id}, null);`
                            db.query(employee)
                            mainMenu();
                        }        
                })
                })
            })
            })
                break;

            //UPDATE EMPLOYEE ROLE
            case 'Update Employee Role':
                console.log('updating employees roles');
                mainMenu();
                break;

            //VIEW ALL ROLES
            case 'View All Roles':
                db.query(viewAllRoles, (err, res) => {
                    if (err) {
                        console.log(err)
                        mainMenu();
                    } else {
                    spaceDivider();
                    console.table(res)
                    spaceDivider();
                    mainMenu();
                    }
                })
                break;

            //ADD ROLES
            case 'Add Role':
                const departmentList = 'SELECT name FROM department;';
                db.query(departmentList, (err, results) => {
                    if (err) throw err;
                    let depList = results.map(results => results.name);                
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

                    let deptId;
                    let salary = parseInt(data.roleSalary)
                    db.query(`SELECT id FROM department WHERE name = '${data.roleDept}';`, (err, results) => {
                        if(err) throw err;
                        deptId = results;
                    const role = `INSERT INTO role (title, salary, department_id) VALUES ("${data.roleName}", ${salary}, ${deptId[0].id});`
                    console.log(role)
                    db.query(role, (err, res) => {
                        if (err) {
                            console.log('Error')
                            mainMenu();
                        } else {
                        console.log('Role Added Succesfully!')
                        mainMenu();
                        }
                    })
                })
            })
            })
                break;

            //VIEW ALL DEPARTMENTS
            case 'View All Departments':
                db.query(viewDepartments, (err, res) => {
                    if (err) {
                        console.log('Error, unable to display departments')
                        mainMenu();
                    } else {
                    spaceDivider();
                    console.table(res)
                    spaceDivider();
                    mainMenu();
                    }
                })
                break;

            //ADDS DEPARTMENT
            case 'Add Department':
                inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'What is the Deparment name?',
                        name: 'department'
                    }
                ]).then((data) => {
                    const department = `INSERT INTO department (name) VALUES ("${data.department}")`
                    db.query(department.trim(), (err) => {
                        if (err) {
                            console.log('error has occured')
                            mainMenu()
                        } else {
                        mainMenu();
                        }
                    })
                })
                break;

            //EXIT OUT OF SESSION
            case 'Quit':
                console.log('Now Exiting...')
                process.exit();
        }
    });
};

function spaceDivider() {
    console.log('\n===============================================================================\n')
};

mysqlLogin();