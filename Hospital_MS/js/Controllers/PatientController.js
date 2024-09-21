require("dotenv").config();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.P_SECRET; 

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
const create = async (req, res) => {
    const { P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email } = req.body;
    // Password Encryption
    try {
        const hashedPassword = await bcrypt.hash(P_password, 10);
        const query = "INSERT INTO `patient`(`P_name`, `P_gender`, `P_address`, `P_age`, `P_password`, `P_mobile`, `P_email`) VALUES (?,?,?,?,?,?,?)";
        db.execute(query, [P_name, P_gender, P_address, P_age, hashedPassword, P_mobile, P_email], (err, result) => {
            if (err) {
                console.error('Error inserting data: ', err);
                res.status(500).send('Error inserting data');
            } 
            const tokenPayload = { name: P_name, email: P_email, id: result.insertId };  // You can adjust the payload as needed
            const token = jwt.sign(tokenPayload, secret, { expiresIn: '1d' });

            // Set the JWT as a cookie
            res.cookie('auth_token', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });  // 1 day expiry
            res.redirect('/P_logIn');
        });
    } catch (error) {
        console.error('Error hashing password: ', error);
        res.status(500).send('Error creating account');
    }
};

//READ
const read = async (req, res) => {
    try {
        const P_id = req.params.id
        if(!P_id) {
            return res.status(404).send({
                success:false,
                message:"Invalid Patient ID"
            })
        }
    const query = await db.query('SELECT * FROM Patient WHERE id=?',[P_id])
    if(query){
        return res.status(404).send({
            success:false,
            message:"No Patient Details Found"
        })
    }
    res.status(200).send({
        success:true,
        PatientDetails: query[0],
    });
}   catch (error) {
    console.error('Error updating data: ', err);
        res.status(500).send('Error updating data');
    console.log(error)
    res.status(500).send({
        success:false,
        message:'Error in Update Patient API',
        error,
    });
}
};
    
//UPDATE
const update = async (req, res) => {
    try{
        const { P_id } = req.params.id
        if (!P_id){
            return res.status(404).send({
                success:false,
                message: "Invalid Patient ID"
            })
        }
        const { P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email } = req.body;
        const query = await db.query(`UPDATE Patient SET P_name = ?, P_gender = ?, P_address = ?, P_age = ?, P_password = ?, P_mobile = ?, P_email = ? WHERE P_id = ?`,[P_name, P_gender, P_address, P_age, P_password, P_mobile, P_email, P_id])    
        if (!query) {
            return res.status(500).send({
                success:false,
                message:'Error in Updating Data'
            })
        }
        res.status(200).send({
            success:true,
            message:"Patient Details Updated Successfully"
        })

    }   catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Get Patient API',
            error,
        });
    }
};

//DELETE
const del = async (req, res) => {
    try {
        const P_id = req.params.id
        if(!P_id){
            return res.status(404).send({
                success:false,
                message:"Invalid Patient ID"
            })
        }
        await db.query('DELETE FROM Patient WHERE P_id = ?', [P_id]);
        res.status(200).send({
            success:true,
            message:'Patient Deleted successfully',
    });
    }   catch (error) {
        console.error('Error deleting data: ', err);
            res.status(500).send('Error deleting data');
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Delete Patient API',
            error,
        });
    }
};

//LOGIN
const login = async (req, res) => {
    try {    
        const { Username, Password } = req.body;
        if (!Username || !Password) {
            return res.status(400).send({
                success: false,
                message: "Username and Password are required"
            });
        }
        const sql = "SELECT `P_email`, `P_password` FROM `patient` WHERE `P_email` = ?";
        db.execute(sql, [Username], async (err, result) => {
            if (err) {
                return res.status(500).send("Server error");
            }

            if (result.length === 0) {
                return res.status(404).send("Invalid Email or Password");
            }

            const isMatch = await bcrypt.compare(Password, result[0].P_password);
            if (!isMatch) {
                return res.status(404).send("Invalid Email or Password");
            }

            const sql2 = "SELECT * FROM `patient` WHERE `P_email` = ?";
            db.execute(sql2, [Username], (err, result2) => {
                if (err) {
                    return res.status(501).send("Email not found while reading");
                }

                const token = jwt.sign({name: result2[0].P_name,gender: result2[0].P_gender,email: result2[0].P_email},secret,{ expiresIn: '1d' });
                res.cookie("auth_token",token,{maxAge:24*60*60*1000, httponly:true})
                const data = {
                    name:result2[0].P_name,
                    age:result2[0].P_age,
                    gender:result2[0].P_gender,
                    mobile:result2[0].P_mobile,
                    email:result2[0].P_email,
                }
                console.log(data.name)
                res.render("patientDashboard",data)

            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
};

module.exports = {create, update, read, del, login}
