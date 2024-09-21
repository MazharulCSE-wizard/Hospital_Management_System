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

});

const infoGet = async(req,res) => {
    const id = req.params.id
    try{
        sql = "SELECT * FROM `doctor` WHERE `D_id` = ?"
        db.execute(sql,[id],(err,result)=>{
            if (err){
                res.status(500).send("ID invalid")
            }
            const data = {
                id:result[0].D_id,
                name:result[0].D_name,
                age:result[0].D_age,
                gender:result[0].D_gender,
                mobile:result[0].D_mobile,
                email:result[0].D_email,
                expertise:result[0].Specialization
            }
            res.render("updateDoctor",data)
        })
    } catch (err) {
        console.log(err);
    }
}

const updateData = async (req, res) => {
    const id = req.params.id;
    const { Dname, Dage, gender, Dmobile, Demail, Specialization } = req.body;

    console.log("Updating data:", { Dname, Dage, gender, Dmobile, Demail, Specialization, id });

    // Check for undefined values
    if (!Dname || !Dage || !gender || !Dmobile || !Demail || !Specialization || !id) {
        return res.status(400).send("One or more fields are invalid");
    }

    try {
        const sql = "UPDATE `doctor` SET `D_name`=?, `D_age`=?, `D_gender`=?, `D_mobile`=?, `D_email`=?, `Specialization`=? WHERE `D_id`=?";
        db.execute(sql, [Dname, Dage, gender, Dmobile, Demail, Specialization, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Updating query error");
            }
            console.log(result);
            res.render("doctorDashboard", { id, name: Dname, age: Dage, gender, mobile: Dmobile, email: Demail, expertise: Specialization });
        });
    } catch (err) {
        console.error(err);
        res.status(502).send("Server error");
    }
};


module.exports = {infoGet,updateData}