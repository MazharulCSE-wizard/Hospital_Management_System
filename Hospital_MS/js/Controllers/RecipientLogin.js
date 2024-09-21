require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require("mysql2");
const secret = process.env.SECRET;

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

const login = async (req, res) => {
    const { R_email, R_password } = req.body;
    
    if (!R_email || !R_password) {
        return res.status(400).send("Invalid Email or Password");
    }

    try {
        const sql = "SELECT `R_email`, `R_password` FROM `Recipient` WHERE `R_email` = ?";
        db.execute(sql, [R_email], async (err, result) => {
            if (err) {
                return res.status(500).send("Server error");
            }

            if (result.length === 0) {
                return res.status(404).send("Invalid Email or Password");
            }

            const isMatch = await bcrypt.compare(R_password, result[0].R_password);
            if (!isMatch) {
                return res.status(404).send("Invalid Email or Password");
            }

            const sql2 = "SELECT * FROM `Recipient` WHERE `R_email` = ?";
            db.execute(sql2, [R_email], (err, result2) => {
                if (err) {
                    return res.status(501).send("Email not found while reading");
                }

                const token = jwt.sign({ name: result2[0].R_name, email: result2[0].R_email }, secret, { expiresIn: '1d' });
                res.cookie("auth_token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
                
                const data = {
                    name: result2[0].R_name,
                    age: result2[0].R_age,
                    gender: result2[0].R_gender,
                    mobile: result2[0].R_mobile,
                    email: result2[0].R_email
                };
                
                res.render("recipientDashboard", data); // Adjust this to your actual dashboard rendering
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
};

module.exports = { login };
