const express = require('express');
const bodyParser = require("body-parser");
const db = require("./db");

const app = express()
const port= process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Create database
app.post('/doctor',(req,res)=>{
    var name = req.body.Dname;
    var age = req.body.Dage;
    var gender = req.body.gender;
    var mobile = req.body.Dmobile;
    var email  =req.body.Demail;
    var password = req.body.Dpassword;
    var specialization = req.body.Specialization;

    db.connect((err)=>{
        if (err) throw err;

        var sql = "INSERT INTO HOSPITAL_MS(D_name,D_age,D_gender,D_mobile,D_email,D_password,Specialization) VALUES (?,?,?,?,?,?,?)";
        const values = [name,age,gender.mobile,email,password,specialization]
        db.query(sql,values, (err,res)=>{
            if(err) throw err;
            res.send("Account creation successful")
        })
    })

})

app.listen(port, () => {
    console.log(`Server running successfully on ${port}`)
})