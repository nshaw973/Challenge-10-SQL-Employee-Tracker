const inquirer = require('inquirer');
const mysql = require('mysql2');
const {viewAllEmployees, viewDepartments, viewAllRoles} = require('./queries/query.js')
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
                console.error(err)
                process.exit(1);
            }
            console.log('Connected to database...');
            mainMenu()
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
                console.log('Adding Employees');
                mainMenu();
                break;
            case 'Update Employee Role':
                console.log('updating employees roles');
                mainMenu();
                break;
            case 'View All Roles':
                db.query(viewAllRoles, (err, res) => {
                    if (err) {
                        console.log('Error, unable to display Roles')
                        mainMenu();
                    } else {
                    spaceDivider();
                    console.table(res)
                    spaceDivider();
                    mainMenu();
                    }
                })
                mainMenu();
                break;
            case 'Add Role':
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
                        name: 'roleDepartment',
                        choices: [1, 2, 5, 7]
                    }
                ]).then((data) => {
                    let salary = parseInt(data.roleSalary)
                    const role = `INSERT INTO role (title, salary, department_id) VALUES ("${data.roleName}", ${salary}, ${data.roleDepartment});`
                    db.query(role, (err, res) => {
                        if (err) {
                            console.log('Error')
                            mainMenu();
                        } else {
                        mainMenu();
                        }
                    })
                })
                break;
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
                mainMenu();
                break;
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
