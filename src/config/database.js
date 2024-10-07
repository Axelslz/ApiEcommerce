const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',  
  user: process.env.DB_USER || 'root',       
  password: process.env.DB_PASS || '', 
  database: process.env.DB_NAME || 'agentelite', 
  port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

module.exports = connection;

