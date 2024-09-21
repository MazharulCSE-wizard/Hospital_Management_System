require("dotenv").config();
const express = require('express');
const path = require('path')
var multer = require("multer");
var upload = multer();
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const recipientRoutes = require("./recipientRoutes");
const mysql = require("mysql2");
const session = require("express-session");
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

app.use('/patient', require("../js/Routes/patientCRUDRoute"), (req, res, next) => {
    console.log(`Request received: ${req.method} : ${req.url}`);
    next();
});

app.use("/logIN", require("../js/Routes/patientLogIn"), (req, res, next) => {
    console.log(`Login Request received: ${req.method} : ${req.url}`);
    next();
});

app.get('/P_logIn', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'patient', 'P_logIn.html'));
});
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public")); // Serve static files
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true
}));

// Use the recipient routes
app.use('/api', recipientRoutes);

// Set view engine
app.set('view engine', 'ejs');

// Serve the login page
app.get("/", (req, res) => {
    res.render("login"); // Renders the login HTML page
});
app.listen(port, () => {
    console.log(`Server running successfully on ${port}`);
});
