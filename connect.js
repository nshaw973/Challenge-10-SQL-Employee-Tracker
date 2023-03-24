const mysql = require('mysql2');
const inquirer = require('inquirer');

function mysqlLogin () {
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
                resolve(db)
                };
            });
        });
        
    })
};

    module.exports = { mysqlLogin };