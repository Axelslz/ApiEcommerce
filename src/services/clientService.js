const Client = require('../models/clientModel');

const ClientService = {
    addClient: (data) => {
        return new Promise((resolve, reject) => {
            Client.addClient(data, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    updateClient: (id, data) => {
        return new Promise((resolve, reject) => {
            Client.updateClient(id, data, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    searchClients: (query) => {
        return new Promise((resolve, reject) => {
            Client.searchClients(query, (err, results) => {  // Cambiar aquí
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
};

module.exports = ClientService;




