const mysql = require('mysql2');
const inquirer = require('inquirer');

// Uses inquirer to login to mysql
function mysqlLogin () {
    //turning the function into a promise, to both create an asynchronus function
    //that will be added to a const db in the index.js
    return new Promise((resolve, reject) => {
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
            
            // This db, is what's going to be returned as the value for db in index.js
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
                    console.log('Error with login, please check username or password.');
                    process.exit(1);
                } else {
                console.log('Connected to database...');
                //Returns teh db value with the filled out login info.
                resolve(db)
                };
            });
        });
        
    })
};

module.exports = { mysqlLogin };