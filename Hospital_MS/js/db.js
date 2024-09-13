const mysql= require("mysql2")
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_ms'
})

db.connect((err)=>{
    if (err) throw err;
});

module.exports = db