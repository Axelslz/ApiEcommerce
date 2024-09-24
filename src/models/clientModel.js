const db = require('../config/database');

const ClientModel = {
  create: (clientData, callback) => {
    const query = 'INSERT INTO clients (name, surname, phone, emergency_contact, email, birthdate, age) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [
      clientData.name, 
      clientData.surname, 
      clientData.phone, 
      clientData.emergency_contact, 
      clientData.email, 
      clientData.birthdate, 
      clientData.age
    ], callback);
  },
  
  findById: (id, callback) => {
    const query = 'SELECT * FROM clients WHERE id = ?';
    db.query(query, [id], callback);
  },

  update: (id, clientData, callback) => {
    const query = 'UPDATE clients SET name = ?, surname = ?, phone = ?, emergency_contact = ?, email = ?, birthdate = ?, age = ? WHERE id = ?';
    db.query(query, [
      clientData.name, 
      clientData.surname, 
      clientData.phone, 
      clientData.emergency_contact, 
      clientData.email, 
      clientData.birthdate, 
      clientData.age,
      id
    ], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM clients WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = ClientModel;
