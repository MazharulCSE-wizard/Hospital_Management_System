const express = require('express');
const bodyParser = require("body-parser");
const db = require("./db");

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Create database
