const inquirer = require('inquirer');
const mysql = require('mysql2');
const {viewAllEmployees} = require('./queries/query.js')
const cTable = require('console.table');


//will be used to create the db data
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: `root`,
      password: '',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

//Inquirer function to ask the user for the username and password to login into mysql
/* async function mysqlLogin () {
    await inquirer
    .prompt ([
        {
            type: 'input',
            message: 'mysql username',
            name: 'username'
        },
        {
            type: 'password',
            message: 'Enter Password',
            name: 'password'
        }
    ]).then((data) => {
        return data
    })
}
 */

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
                    }
                    console.log('===============================================================================\n')
                    console.table(res)
                    console.log('===============================================================================\n')
                    mainMenu();
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
                console.log('viewing all roles');
                mainMenu();
                break;
            case 'Add Role':
                console.log('Adding a Role');
                mainMenu();
                break;
            case 'View All Departments':
                console.log('viewing all departments');
                mainMenu();
                break;
            case 'Add Department':
                console.log('Adding a Department');
                mainMenu();
                break;
            case 'Quit':
                console.log('Now Exiting...')
                process.exit();
        }
    });
};

mainMenu();