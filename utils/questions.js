const inquire = require("inquirer");

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
                    console.log("Viewing all employees");
                    break;
                case "View all departments":
                    console.log("Viewing all departments");
                    break;
                case "View all roles":
                    console.log("Viewing all roles");
                    break;
                case "Add an employee":
                    employeeChoice();
                    break;
                case "Add a role":
                    console.log("Adding role");
                    break;
                case "Add a department":
                    console.log("Adding department");
                    break;
                case "Update an employee":
                    console.log("Updating employee");
                    break;
                default:
                    console.log("Switch case default")
            }
        })
}

const employeeChoice = () => {
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
            type: "input",
            message: "Please enter the employee's role. ",
            name: "employeeRole"
        },
        {
            type: "input",
            message: "Please enter the employee's manager. ",
            name: "employeeManager"
        },
    ])
        .then((data) => {
            console.log(data)
        })
}


module.exports = { menu };