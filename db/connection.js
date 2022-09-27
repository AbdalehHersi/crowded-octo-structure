const mysql = require("mysql2");
// require('dotenv').config();

const db = mysql.createConnection(
    {
        host: "localhost",
        user: 'root',
        password: 'eSTInAnew',
        database: 'employees_db'
    },
    console.log(`Connected to employees_db`)
)


module.exports = { db }