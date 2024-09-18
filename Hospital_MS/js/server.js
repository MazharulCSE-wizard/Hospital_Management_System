const express = require('express');
const bodyParser = require("body-parser");
const db = require("./db");

const app = express()
const port= process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))




app.listen(port, () => {
    console.log(`Server running successfully on ${port}`)
})