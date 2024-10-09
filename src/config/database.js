const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'mysql.railway.internal',       
  user: 'root',            
  password: 'rQlGAeeNIvJKiJhkwsjuCDyVONtSpHNa',            
  database: 'railway',  
  port: 3306              
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

module.exports = connection;

