const db = require('../config/database');

const UserModel = {
  create: (userData, callback) => {
    const query = 'INSERT INTO users (name, last_name, email, password, profile_picture) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userData.name, userData.last_name, userData.email, userData.password, userData.profile_picture], callback);
  },
  
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        console.log("Results from DB: ", results); 
        callback(err, results[0]); 
    });
  },
  
  update: (id, userData, callback) => {
    const query = 'UPDATE users SET name = ?, last_name = ?, email = ?, profile_picture = ? WHERE id = ?';
    console.log("Ejecutando consulta SQL:", query); // Para depurar la consulta
    db.query(query, [userData.name, userData.last_name, userData.email, userData.profile_picture, id], (err, results) => {
      if (err) {
        console.error('Error en la consulta SQL:', err); // Mostrar el error SQL exacto
        return callback(err, null); 
      }
      callback(null, results); 
    });
  }, 
  
  findById: (id, callback) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      // Verifica si hay resultados
      if (results.length > 0) {
        return callback(null, results[0]); // Devuelve el primer resultado
      } else {
        return callback(new Error('Usuario no encontrado')); // Maneja el caso donde no se encuentra el usuario
      }
    });
  },
};

module.exports = UserModel;
