require("dotenv").config();
const express = require('express')
const cookieParser = require("cookie-parser");
const path = require('path')
var multer = require("multer");
var methodOverride = require('method-override');
var upload = multer();
const app = express();
const port = process.env.PORT || 3000;

console.log(path.join(__dirname,"public"))
app.set('view engine', 'ejs')
app.set('views' , path.join(__dirname,"views"))


// Middleware to handle URL-encoded form data and JSON data
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.array()); // For handling file uploads (Multer)
app.use(cookieParser());


// Route to handle form submissions
app.use("/createdoctor", require("../js/Routes/doctorpostRoute"), (req, res, next) => {
    console.log(`Request received: ${req.method} : ${req.url}`);
    next();
});

app.use("/doctorlogin", require("../js/Routes/DoctorLoginroute"), (req, res, next) => {
    console.log(`Request received: ${req.method} : ${req.url}`);
    next();
});
// app.get("/updatedoc", (req,res)=>{
//     console.log(req.body)
//     res.render("updateDoctor")
// })
app.use("/updatedoc", require("../js/Routes/doctorupdate"),  (req, res, next) => {
    console.log(`Request received: ${req.method} : ${req.url}`);
    next();
})
app.use("/logout", require("../js/Routes/DoctorLoginroute"),  (req, res, next) => {
    console.log(`Request received: ${req.method} : ${req.url}`);
    next();
})

app.use("/delete", require("../js/Routes/DoctorLoginroute"),  (req, res, next) => {
    console.log(`Request received: ${req.method} : ${req.url}`);
    next();
})

app.listen(port, () => {
    console.log(`Server running successfully on ${port}`);
});
