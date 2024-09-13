const express = require('express');
const router = express.Router();
const db = require('../db');
//CREATE 
router.post('/add', (req, res) => {
    const { P_id, P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email } = req.body;    
    const query = `INSERT INTO Patient (P_id, P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [P_id, P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email], (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            res.status(500).send('Error inserting data');
        } else {
            console.log('Insert result: ', result);
            res.status(200).send('Patient added successfully');
        }
    });
});
//READ
router.get('/all', (req, res) => {
    const query = 'SELECT * FROM Patient';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Error fetching data');
        } else {
            res.status(200).json(results);
        }
    });
});
//UPDATE
router.put('/update/:Pid', (req, res) => {
    const { P_id } = req.params;
    const { P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email } = req.body;
    const query = `UPDATE Patient SET Pname = ?, Pgender = ?, Paddress = ?, P_age = ?, 
                   P_password = ?, Pmobile = ?, Pemail = ? WHERE Pid = ?`;
    db.query(query, [P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email, P_id], (err, result) => {
        if (err) {
            console.error('Error updating data: ', err);
            res.status(500).send('Error updating data');
        } else {
            res.status(200).send('Patient updated successfully');
        }
    });
});
//DELETE
router.delete('/delete/:Pid', (req, res) => {
    const { P_id } = req.params;
    const query = 'DELETE FROM Patient WHERE Pid = ?';
    db.query(query, [P_id], (err, result) => {
        if (err) {
            console.error('Error deleting data: ', err);
            res.status(500).send('Error deleting data');
        } else {
            res.status(200).send('Patient deleted successfully');
        }
    });
});

module.exports = router;