const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',  
    user: 'root', 
    password: '', 
    database: 'hospital_ms'  
});

db.connect(err => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + db.threadId);
});

module.exports = db;