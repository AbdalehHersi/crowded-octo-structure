const inquire = require("inquirer");
const { db } = require("./db/connection");
const cTable = require('console.table');

const menu = () => {
    inquire.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "menuChoices",
            choices: [
                'View all employees',
                'View all departments',
                'View all roles',
                'Add an employee',
                'Add a department',
                'Add a role',
                'Update an employee']
        }
    ])
        .then((data) => {
            switch (data.menuChoices) {
                case "View all employees":
                    viewEmployee();
                    break;
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Update an employee":
                    updateEmployee()
                    break;
                default:
                    console.log("Switch case default")
            }
        })
}

const addDepartment = () => {
    inquire.prompt([
        {
            type: "input",
            message: "Please enter the name of the department. ",
            name: "name"
        }
    ])
        .then((data) => {
            db.query("INSERT INTO department SET ?",
                {
                    department_name: data.name
                }, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                })


            db.query("SELECT * FROM department", (err, res) => {
                if (err) throw err;
                console.table(res);
                menu();
            })



        })
}

const viewEmployee = () => {
    db.query(`
    SELECT employee.id, employee.first_name, employee.last_name, roles.title AS job_title,
    department.department_name,
    roles.salary,
    employee.manager_id FROM employee JOIN roles ON employee.role_id = roles.id
    JOIN department ON roles.department_id = department.id
    ORDER BY employee.id;
    `, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    })

}

const viewRole = () => {
    db.query(`SELECT * FROM roles LEFT JOIN department ON roles.department_id = department.id;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    })
}

const viewDepartments = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    })
}

const addEmployee = () => {
    let rolesArr = []
    let managerArr = [];
    let Name = [];
    db.query(`SELECT * FROM employee`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            Name.push(res[i].first_name + " " + res[i].last_name)
        }

    })
    db.query(`SELECT roles.title FROM roles`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            rolesArr.push(res[i].title);
        }
        Name.unshift("None");
        inquire.prompt([
            {
                type: "input",
                message: "Please enter the employees first name. ",
                name: "employeeFirstName"
            },
            {
                type: "input",
                message: "Please enter the employees last name. ",
                name: "employeeLastName"
            },
            {
                type: "list",
                message: "Please enter the employee's role. ",
                name: "employeeRole",
                choices: rolesArr
            },
            {
                type: "list",
                message: "Who is the employees manager? ",
                name: "employeeManager",
                choices: Name
            },
        ])
            .then((data) => {
                if (data.employeeManager === "None") {
                    db.query(`SELECT * FROM roles WHERE roles.title = '${data.employeeRole}'`, (err, res) => {
                        if (err) throw err;
                        db.query("INSERT INTO employee SET ?",
                            {
                                first_name: data.employeeFirstName,
                                last_name: data.employeeLastName,
                                role_id: res[0].id
                            },
                            (err, res) => {
                                if (err) throw err;
                                console.log(`Added ${data.employeeFirstName} ${data.employeeLastName} to the database`);
                            })
                    })
                } else {
                    db.query(`SELECT * FROM employee WHERE employee.first_name = '${data.employeeManager}'`, (err, res) => {
                        if (err) throw err;
                        console.table(res);
                    })
                }
            })
    })


}

const addRole = () => {
    let departmentArr = [];
    db.query(`SELECT * FROM department`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            departmentArr.push(res[i].department_name);
        }
        inquire.prompt([
            {
                type: "input",
                message: "Please enter the name of the role. ",
                name: "roleTitle"
            },
            {
                type: "input",
                message: "Please enter the role salary. ",
                name: "roleSalary"
            },
            {
                type: "list",
                message: "Choose which department you want to add to.",
                name: "roleDep",
                choices: departmentArr
            }
        ])
            .then((data) => {
                db.query(`SELECT * FROM department WHERE department_name = '${data.roleDep}'`, (err, res) => {
                    if (err) throw err;
                    let depID = res[0].id;
                    db.query("INSERT INTO roles SET ?",
                        {
                            title: data.roleTitle,
                            salary: data.roleSalary,
                            department_id: depID
                        }, (err, res) => {
                            if (err) throw err;
                            console.log(`Added ${data.roleDep} to the database.`)
                            menu();
                        })
                })
            })
    })
}

const updateEmployee = () => {
    const roleArr = [];
    const employeeArr = [];

    db.query(`SELECT * FROM roles`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }
    })

    db.query(`SELECT * FROM employee`, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            let employeeName = `${res[i].first_name} ${res[i].last_name}`
            employeeArr.push(employeeName);
        }
        return
    })
}

module.exports = { menu };