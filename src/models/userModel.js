const db = require('../config/database');

const UserModel = {
  create: (userData, callback) => {
    const query = 'INSERT INTO users (name, email, password, profile_picture) VALUES (?, ?, ?, ?)';
    db.query(query, [userData.name, userData.email, userData.password, userData.profile_picture], callback);
  },
  
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        console.log("Results from DB: ", results); // Agrega esto para depuración
        callback(err, results[0]); // Asegúrate de devolver solo un usuario
    });
  },
  
  update: (id, userData, callback) => {
    const query = 'UPDATE users SET name = ?, email = ?, profile_picture = ? WHERE id = ?';
    db.query(query, [userData.name, userData.email, userData.profile_picture, id], callback);
  },
  
  findById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = UserModel;
