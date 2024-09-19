require("dotenv").config();
const express = require('express');
var multer = require("multer");
var upload = multer();
const port= process.env.PORT || 3000;



const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(upload.array())

app.use("/createdoctor" , require("../js/Routes/doctorpostRoute" ), (req,res,next) =>{
    console.log(`Request receive ${req.method} : ${req.url}`)
    next()
})

app.listen(port, () => {
    console.log(`Server running successfully on ${port}`)
})