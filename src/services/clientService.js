const ClientModel = require('../models/clientModel');

const ClientService = {
    addClient: (data) => {
        return new Promise((resolve, reject) => {
            ClientModel.addClient(data, (err, result) => { 
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    updateClient: (id, data) => {
        return new Promise((resolve, reject) => {
            ClientModel.updateClient(id, data, (err, result) => {  
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    searchClients: (query) => {
        return new Promise((resolve, reject) => {
            ClientModel.searchClients(query, (err, results) => {  
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
};

module.exports = ClientService;





