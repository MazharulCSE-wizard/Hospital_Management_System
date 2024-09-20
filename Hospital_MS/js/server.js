require("dotenv").config();
const express = require('express');
const path = require('path')
var multer = require("multer");
var upload = multer();
const app = express();
const port = process.env.PORT || 3000;

console.log(path.join(__dirname,"public"))
app.set('view engine', 'ejs')
app.set('views' , path.join(__dirname,"views"))


// Middleware to handle URL-encoded form data and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.array()); // For handling file uploads (Multer)
app.use(express.static(path.join(__dirname,"public")));
// Route to handle form submissions
app.use("/createdoctor", require("../js/Routes/doctorpostRoute"), (req, res, next) => {
    console.log(`Request received: ${req.method} : ${req.url}`);
    next();
});

app.use("/doctorlogin", require("../js/Routes/DoctorLoginroute"), (req, res, next) => {
    console.log(`Request received: ${req.method} : ${req.url}`);
    next();
});

app.listen(port, () => {
    console.log(`Server running successfully on ${port}`);
});
