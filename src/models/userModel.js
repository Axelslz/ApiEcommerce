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
    db.query(query, [userData.name, userData.last_name, userData.email, id], callback);
  },
  
  findById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = UserModel;
