// adminController.js

const mysql = require('mysql2');
const bcrypt = require('bcrypt');
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

// Function to authenticate the admin
const login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM Admin WHERE Email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying the database: ', err);
      return res.status(500).send('Internal server error');
    }

    if (results.length === 0) {
      return res.status(401).send('Admin not found');
    }

    const admin = results[0];

    // Compare the password with the stored hash
    bcrypt.compare(password, admin.Password, (err, result) => {
      if (result) {
        // Password matches, set session or token
        req.session.admin = admin; // Assuming you use express-session
        res.redirect('/dashboard');
      } else {
        res.status(401).send('Incorrect password');
      }
    });
  });
};

// Function to display hospitals (CRUD operations)
const getHospitals = (req, res) => {
  db.query('SELECT * FROM Hospital', (err, results) => {
    if (err) {
      console.error('Error fetching hospitals: ', err);
      return res.status(500).send('Internal server error');
    }
    res.render('dashboard', { hospitals: results });
  });
};

// Function to update hospital information
const updateHospital = (req, res) => {
  const { H_id, H_name, H_address } = req.body;

  db.query(
    'UPDATE Hospital SET H_name = ?, H_address = ? WHERE H_id = ?',
    [H_name, H_address, H_id],
    (err, result) => {
      if (err) {
        console.error('Error updating hospital: ', err);
        return res.status(500).send('Internal server error');
      }
      res.redirect('/dashboard');
    }
  );
};

// Function to delete hospital
const deleteHospital = (req, res) => {
  const { H_id } = req.body;

  db.query('DELETE FROM Hospital WHERE H_id = ?', [H_id], (err, result) => {
    if (err) {
      console.error('Error deleting hospital: ', err);
      return res.status(500).send('Internal server error');
    }
    res.redirect('/dashboard');
  });
};

module.exports = { login, getHospitals, updateHospital, deleteHospital };
