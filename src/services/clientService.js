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
    }
};

module.exports = ClientService;



