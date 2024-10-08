const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',       // Cambiar a localhost para usar XAMPP
  user: 'root',            // Usuario por defecto de XAMPP
  password: '',            // Contraseña por defecto (generalmente está vacía)
  database: 'agentelite',  // Asegúrate de que esta base de datos exista en tu XAMPP
  port: 3306               // Puerto por defecto de MySQL
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

module.exports = connection;

