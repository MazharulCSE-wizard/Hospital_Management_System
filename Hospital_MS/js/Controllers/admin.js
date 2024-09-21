// admin.js

const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // change if different
  password: '', // add password if set
  database: 'hospital_management' // the database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
