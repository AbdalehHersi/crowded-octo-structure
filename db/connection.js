const mysql = require("mysql2");
require('dotenv').config();

const PORT = process.env.PORT || 3001;


const db = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log("Connected to database", process.env.DB_PASSWORD, process.env.DB_USER, process.env.DB_NAME)
)