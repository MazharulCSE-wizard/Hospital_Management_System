require("dotenv").config();
const express = require('express');
var multer = require("multer");
var upload = multer();

const app = express();
const port = process.env.PORT || 3000;


// Middleware to handle URL-encoded form data and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.array()); // For handling file uploads (Multer)

// Route to handle form submissions
app.use("/createdoctor", require("../js/Routes/doctorpostRoute"), (req, res, next) => {
    console.log(`Request received: ${req.method} : ${req.url}`);
    next();
});

app.listen(port, () => {
    console.log(`Server running successfully on ${port}`);
});
