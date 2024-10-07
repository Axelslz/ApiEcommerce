const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'apiecommerce.railway.internal',  
  user: 'agent',                         
  password: 'liteA4231',                 
  database: 'agentelite',                 
  port: 3306                              
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

module.exports = connection;

