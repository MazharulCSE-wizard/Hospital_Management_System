const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

//MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_ms'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database Connected');
});

//CREATE 
const create = (req, res) => {
    const {P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email } = req.body;    
    const query = "INSERT INTO `patient`(`P_name`, `P_gender`, `P_address`, `P_password`, `P_mobile`, `P_email`, `P_age`) VALUES (?,?,?,?,?,?,?)";
    db.query(query, [P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email], (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            res.status(500).send('Error inserting data');
        } else {
            console.log('Insert result: ', result);
            res.status(200).send('Patient created successfully');
        }
    });
};

//READ
const read = (req, res) => {
    const query = 'SELECT * FROM Patient';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
        } else {
            res.status(200).json(results);
        }
    });
};
//UPDATE
const update = (req, res) => {
    const { P_id } = req.params;
    const { P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email } = req.body;
    const query = `UPDATE Patient SET P_name = ?, P_gender = ?, P_address = ?, P_age = ?, 
                   P_password = ?, P_mobile = ?, P_email = ? WHERE P_id = ?`;
    db.query(query, [P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email, P_id], (err, result) => {
        if (err) {
            console.error('Error updating data: ', err);
            res.status(500).send('Error updating data');
        } else {
            res.status(200).send('Patient updated successfully');
        }
    });
};
//DELETE
const del = (req, res) => {
    const { P_id } = req.params;
    const query = 'DELETE FROM Patient WHERE P_id = ?';
    db.query(query, [P_id], (err, result) => {
        if (err) {
            console.error('Error deleting data: ', err);
            res.status(500).send('Error deleting data');
        } else {
            res.status(200).send('Patient deleted successfully');
        }
    });
};

module.exports = {create, update, read, del}