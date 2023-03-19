const inquirer = require('inquirer');
const db = require('mysql2');

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
                console.log('Viewing all employees');
                mainMenu();
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