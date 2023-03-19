INSERT INTO department (name)
    VALUES  ("Specialty"),
            ("Produce"),
            ("Bakery"),
            ("Prep Foods"),
            ("Grocery"),
            ("Customer Service"),
            ("Management");


INSERT INTO role (title, salary, department_id)
    VALUES  ("TL", 60000, 3),
            ("ATL", 50000, 4),
            ("STL", 80000, 1),
            ("ASTL", 70000, 2),
            ("Order Writer", 45000, 5),
            ("Team Member", 40000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES  ("Johnny", "Smith", 6, NULL),
            ("Steven", "Carry", 5, NULL),
            ("Nathan", "Serrano", 4, 4);

