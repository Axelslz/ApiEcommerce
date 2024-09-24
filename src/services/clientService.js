const ClientModel = require('../models/clientModel');
const db = require('../config/database');

const ClientService = {
  createClient: (clientData) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO clients (name, surname, phone, emergency_contact, email, birthdate, age) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [
            clientData.name,
            clientData.surname,
            clientData.phone,
            clientData.emergency_contact, 
            clientData.email,
            clientData.birthdate,
            clientData.age
        ];
        
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
},

  getClientById: (id) => {
    return new Promise((resolve, reject) => {
      ClientModel.findById(id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  updateClient: (id, clientData) => {
    return new Promise((resolve, reject) => {
      ClientModel.update(id, clientData, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  deleteClient: (id) => {
    return new Promise((resolve, reject) => {
      ClientModel.delete(id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
};

module.exports = ClientService;
