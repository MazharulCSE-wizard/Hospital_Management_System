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
    const { demail, dpassword } = req.body;
    console.log(demail);
    
    if (!demail || !dpassword) {
        return res.status(400).send("Invalid Email or Password");
    }

    try {
        const sql = "SELECT `D_email`, `D_password` FROM `doctor` WHERE `D_email` = ?";
        db.execute(sql, [demail], async (err, result) => {
            if (err) {
                return res.status(500).send("Server error");
            }

            if (result.length === 0) {
                return res.status(404).send("Invalid Email or Password");
            }

            const isMatch = await bcrypt.compare(dpassword, result[0].D_password);
            if (!isMatch) {
                return res.status(404).send("Invalid Email or Password");
            }

            const sql2 = "SELECT * FROM `doctor` WHERE `D_email` = ?";
            db.execute(sql2, [demail], (err, result2) => {
                if (err) {
                    return res.status(501).send("Email not found while reading");
                }

                const token = jwt.sign({name: result2[0].D_name,gender: result2[0].D_gender,email: result2[0].D_email},secret,{ expiresIn: '1d' });
                res.cookie("auth_token",token,{maxAge:24*60*60*1000, httponly:true})
                const data = {
                    id:result2[0].D_id,
                    name:result2[0].D_name,
                    age:result2[0].D_age,
                    gender:result2[0].D_gender,
                    mobile:result2[0].D_mobile,
                    email:result2[0].D_email,
                    expertise:result2[0].Specialization
                }
                console.log(data.name)
                res.render("doctorDashboard",data)

            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
};


const middleware = (req, res, next) => {
    const token = req.cookies.auth_token; // Ensure the correct cookie is accessed

    if (!token) {
        return res.redirect("http://127.0.0.1:5500/Hospital_MS/doctor/D_logIn.html");
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.redirect("http://127.0.0.1:5500/Hospital_MS/doctor/D_logIn.html");
        }
        req.id = decoded.id; // Ensure this matches what you encode in the token
        next();
    });
};

const logout = async(req,res)=>{
    res.clearCookie('auth_token');
    res.redirect("http://127.0.0.1:5500/Hospital_MS/doctor/D_logIn.html")
}

const deleteUser = async(req,res)=>{
    const id = req.params.id;
    sql="DELETE FROM `doctor` WHERE `D_id`=?"
    db.execute(sql,[id],(err,result)=>{
        if (err){
            res.status(500).send("Error Deleting query")
        }
        console.log(result)
        res.clearCookie('auth_token');
        res.redirect("http://127.0.0.1:5500/Hospital_MS/doctor/D_logIn.html")
    })
}
module.exports = { middleware, login ,logout,deleteUser};