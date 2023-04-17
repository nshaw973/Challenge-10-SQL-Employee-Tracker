const inquirer = require('inquirer');
const cTable = require('console.table');

const {
  viewAllEmployees,
  viewDepartments,
  viewAllRoles,
  queries,
} = require('./queries/query.js');
const { mysqlLogin } = require('./connect.js');

//stores the login info for mysql, found in init function
let db;

//Connects to the connect.js file that stores the inquirer process to login to mysql
async function init() {
  try {
    //Makes sure db gets login info before moving on to the menu
    db = await mysqlLogin();
    mainMenu();
  } catch (err) {
    console.log(err);
  }
}

//This is the Main Menu for inquirer which has all the options who will then branch out into their respective functions.
function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'menuOption',
        choices: [
          'View All Employees',
          'Add Employee',
          'Update Employee Role',
          'Update Employee Manager',
          'View All Roles',
          'Add Role',
          'View All Departments',
          'Add Department',
          'Quit',
        ],
      },
    ])
    .then((data) => {
      // Takes one of the choices the user chose, and selects the corresponding case that matches.
      switch (data.menuOption) {
        //VIEW ALL EMPLOYEES //
        case 'View All Employees':
          db.query(viewAllEmployees, (err, res) => {
            if (res.length === 0) {
              console.log('Error, no employees to display!');
              mainMenu();
            } else {
              displayTable(res);
            }
          });
          break;

        // ADD EMPLOYEE //
        case 'Add Employee':
          // Looks for available Roles to add employee to.
          db.query(queries.roleTitle, (err, results) => {
            // Checks to see if any roles are available to add to Employee. Else returns to menu
            if (results.length === 0) {
              console.log('Error, no Roles found. Please add a Role First!');
              return mainMenu();
            }
            // Used to create an array for all the departments available, to use as a list of choices
            const depList = results.map((results) => results.title);
            // Creates an array of all employees that are potential Managers for the employee being created.
            db.query(queries.fullName, (err, results) => {
              // creates an array of all the employees and attaches their first and last name together
              const managerList = results.map(
                (results) => `${results.first_name} ${results.last_name}`
              );
              //adds the none option to allow the user to choose whether or not the employee reports to anyone.
              managerList.push('none');

              inquirer
                .prompt([
                  {
                    type: 'input',
                    message: 'What is the employees first name?',
                    name: 'firstName',
                  },
                  {
                    type: 'input',
                    message: 'What is the employees last name',
                    name: 'lastName',
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
                    choices: managerList,
                  },
                ])
                .then((data) => {
                  // Needed to split the chosen managers name so that they can be used to populate the query
                  // with their corresponding value
                  const name = data.manager.split(' ');
                  // Needed to put the names in an Array to insert into the query.
                  const managerName = [name[0], name[1]];
                  // Selects the id of the department depending on the department name
                  db.query(queries.roleId, data.empRole, (err, results) => {
                    // The main Values that will be inserted, missing the manager id depending if null or not
                    const insertValues = [
                      data.firstName.trim(),
                      data.lastName.trim(),
                      results[0].id,
                    ];
                    // If the user chose a manager, pushes the id of the manager to inserValues
                    if (data.manager !== 'none') {
                      // Creates the new Employee with manager
                      db.query(
                        queries.idRoleFullName,
                        managerName,
                        (err, results) => {
                          insertValues.push(results[0].id);
                          db.query(queries.insertEmployee, insertValues);
                          mainMenu();
                        }
                      );
                    } else {
                      // Adds a null value for no manager
                      insertValues.push(null);
                      db.query(queries.insertEmployee, insertValues);
                      mainMenu();
                    }
                  });
                });
            });
          });
          break;

        //UPDATE EMPLOYEE ROLE
        case 'Update Employee Role':
          // Checks to see if there are any employees in the database.
          db.query(queries.fullName, (err, results) => {
            if (results.length === 0) {
              console.log('Error, No Employees found to Update!');
              return mainMenu();
            }
            // create an array off all the employees in the db
            const employeeList = results.map(
              (results) => `${results.first_name} ${results.last_name}`
            );
            // Fetches all the roles in the database
            db.query(queries.roleTitle, (err, results) => {
              const roleList = results.map((results) => `${results.title}`);

              inquirer
                .prompt([
                  {
                    type: 'list',
                    message: `Which Employee would you like to update?`,
                    name: 'employee',
                    choices: employeeList,
                  },
                  {
                    type: 'list',
                    message: 'What role would you like to assign?',
                    name: 'role',
                    choices: roleList,
                  },
                ])
                .then((data) => {
                  // Grabs role id based on the role title.
                  db.query(queries.roleId, data.role, (err, results) => {
                    // creates the array needed to update the role with the query
                    const name = data.employee.split(' ');
                    const employeeRoleAndName = [
                      results[0].id,
                      name[0],
                      name[1],
                    ];

                    db.query(queries.updateRole, employeeRoleAndName);
                    mainMenu();
                  });
                });
            });
          });

          break;

        //UPDATE EMPLOYEE MANAGER
        case 'Update Employee Manager':
          db.query(queries.fullName, (err, results) => {
            // Error Handling
            if (results.length === 0) {
              console.log('Error, No Employees found to Update!');
              return mainMenu();
            }

            const employeeList = results.map(
              (results) => `${results.first_name} ${results.last_name}`
            );

            db.query(queries.fullName, (err, results) => {
              const managerList = results.map(
                (results) => `${results.first_name} ${results.last_name}`
              );
              managerList.push('none');
              inquirer
                .prompt([
                  {
                    type: 'list',
                    message: `Which employee would you like to update?`,
                    name: 'employee',
                    choices: employeeList,
                  },
                  {
                    type: 'list',
                    message: 'What manager would you like to assign?',
                    name: 'manager',
                    choices: managerList,
                  },
                ])
                .then((data) => {
                  if (data.employee === data.manager) {
                    console.log('Employee cannot be their own manager!');
                    return mainMenu();
                  }
                  const name = data.manager.split(' ');
                  const managerName = [name[0], name[1]];
                  db.query(queries.idRoleFullName, managerName, (err, res) => {
                    const name = data.employee.split(' ');
                    const employeeName = [name[0], name[1]];
                    if (data.manager === 'none') {
                      employeeName.unshift(null);
                    } else if (data.manager !== 'none') {
                      employeeName.unshift(res[0].id);
                    }
                    db.query(
                      queries.updateManager,
                      employeeName,
                      (err, res) => {
                        console.log('Updated manager successfully!');
                        mainMenu();
                      }
                    );
                  });
                });
            });
          });

          break;
        //VIEW ALL ROLES
        case 'View All Roles':
          db.query(viewAllRoles, (err, res) => {
            // Error for an empty role database
            if (res.length === 0) {
              console.log('Error, no roles to display!');
              mainMenu();
            } else {
              displayTable(res);
            }
          });
          break;

        //ADD ROLES
        case 'Add Role':
          db.query(queries.departmentList, (err, results) => {
            // checks to see if role db is empty
            if (results.length === 0) {
              console.log(
                'Unable to add Role, a department is required. Please add a Department.'
              );
              return mainMenu();
            }
            const depList = results.map((results) => results.name);
            inquirer
              .prompt([
                {
                  type: 'input',
                  message: 'Name of the Role?',
                  name: 'roleName',
                },
                {
                  type: 'input',
                  message: 'What is the roles salary',
                  name: 'roleSalary',
                  // Checks to see if the user had inputed a valid number with no characters.
                  validate: function (value) {
                    const num = parseInt(value);
                    if (isNaN(num) || value !== num.toString()) {
                      return 'Please enter a valid integer';
                    }
                    return true;
                  },
                },
                {
                  type: 'list',
                  message: 'What department does this role belong to?',
                  name: 'roleDept',
                  choices: depList,
                },
              ])
              .then((data) => {
                // takes the string value inputed by the user and turns it into an INT
                const salary = parseInt(data.roleSalary);
                db.query(
                  queries.idDepartmentWhereRole,
                  data.roleDept,
                  (err, results) => {
                    // Values to be inserted into role
                    const role = [data.roleName.trim(), salary, results[0].id];

                    db.query(queries.insertRole, role, (err, res) => {
                      console.log('Role Added Succesfully!');
                      mainMenu();
                    });
                  }
                );
              });
          });
          break;

        //VIEW ALL DEPARTMENTS
        case 'View All Departments':
          db.query(viewDepartments, (err, res) => {
            if (res.length === 0) {
              console.log('Error, no departments found!');
              mainMenu();
            } else {
              displayTable(res);
            }
          });
          break;

        //ADDS DEPARTMENT
        case 'Add Department':
          inquirer
            .prompt([
              {
                type: 'input',
                message: 'What is the Department name?',
                name: 'department',
              },
            ])
            .then((data) => {
              db.query(
                queries.insertDepartment,
                data.department.trim(),
                (err) => {
                  if (err) {
                    console.log('error has occured');
                    mainMenu();
                  } else {
                    console.log('Department added successfully!');
                    mainMenu();
                  }
                }
              );
            });
          break;

        //EXIT OUT OF SESSION
        case 'Quit':
          console.log('Now Exiting...');
          process.exit();
      }
    });
}

// Divides up the
function displayTable(table) {
  const divider = [];
  for (let i = 0; i < 100; i++) {
    divider.push('=');
  }
  console.log(`\n${divider.join('')}\n`);
  console.table(table);
  console.log(`\n${divider.join('')}\n`);
  mainMenu();
}

init();
