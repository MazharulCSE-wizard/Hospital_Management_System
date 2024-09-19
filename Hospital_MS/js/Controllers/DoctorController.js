require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require("mysql2");
const secret = process.env.SECRET;  // Secret for JWT

// MySQL connection
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

const register = async (req, res) => {
    const { name, age, gender, mobile, email, password, cpass, hname, spec } = req.body;
    console.log(name)

    // Check for missing fields
    if (!name || !age || !gender || !mobile || !email || !password || !cpass || !hname || !spec) {
        return res.status(400).send('Please fill out all information.');
    }

    // Check if password and confirm password match
    if (password !== cpass) {
        return res.status(401).send('Password and confirm password do not match.');
    }

    try {
        // Encrypt the password asynchronously
        const encrypt_pass = await bcrypt.hash(password, 10);

        // Check if hospital exists and get the hospital ID
        const sql = "SELECT `H_id` FROM `hospital` WHERE `H_name` = ?";
        db.execute(sql, [hname], (err, result) => {
            if (err) {
                return res.status(500).send('Error querying hospital.');
            }
            if (result.length > 0) {
                const hid = result[0].H_id;

                // Insert doctor into the database
                const sql2 = "INSERT INTO `doctor`(`D_name`, `D_age`, `D_gender`, `D_mobile`, `D_email`, `D_password`, `Specialization`, `H_id`) VALUES (?,?,?,?,?,?,?,?)";
                db.execute(sql2, [name, age, gender, mobile, email, encrypt_pass, spec, hid], (err, results) => {
                    if (err) {
                        return res.status(500).send('Error inserting doctor.');
                    }

                    // JWT Generation
                    const tokenPayload = {name:name,email:email, id: results.insertId };  // Adjust payload as needed
                    const token = jwt.sign(tokenPayload, secret, { expiresIn: '1d' });

                    // Set the JWT as a cookie
                    res.cookie('auth_token', token, { httpOnly: true, secure: true, maxAge: 24*60*60*1000 });  // Cookie options (secure: true for HTTPS)

                    // Redirect the user after successful account creation
                    res.redirect('/D_dashboard');  // Replace '/dashboard' with the URL of the destination page

                });
            } else {
                return res.status(404).send("Hospital name doesn't exist.");
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error occurred.');
    }
};

module.exports = {register}
