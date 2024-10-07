const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'apiecommerce-production.up.railway.app',
  user: process.env.DB_USER || 'agent',
  password: process.env.DB_PASSWORD || 'liteA4231',
  database: process.env.DB_NAME || 'agentelite',
  port: process.env.DB_PORT || 3306,
  flags: '-FOUND_ROWS',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the database');
  connection.end();
});

module.exports = connection;

