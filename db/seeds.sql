/* These are for testing purposes. */

INSERT INTO department (name)
    VALUES  ("Management");



INSERT INTO role (title, salary, department_id)
    VALUES  ("Manager", 100000, 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES  ("firstName", "lastName", 1, null),
            ("manager", "manager", 1, 1)


