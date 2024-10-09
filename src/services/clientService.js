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

    searchClients: (searchTerm, page) => {
        return new Promise((resolve, reject) => {
            const limit = 5; 
            const offset = (page - 1) * limit; 
            
            ClientModel.searchClients(searchTerm, (err, results) => { 
                if (err) {
                    return reject(err);
                }
                ClientModel.getTotalClients((err, total) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({ clients: results, totalItems: total });
                });
            });
        });
    },

    getClientsPaginated: (page) => {
        return new Promise((resolve, reject) => {
            const limit = 5;  
            const offset = (page - 1) * limit;  
            ClientModel.getClientsPaginated(limit, offset, (err, results) => {
                if (err) {
                    return reject(err);
                }
                ClientModel.getTotalClients((err, total) => {
                    if (err) {
                        return reject(err);
                    }
                    const totalPages = Math.ceil(total / limit);
                    resolve({ results, totalPages });
                });
            });
        });
    },

    getClientById: (id) => {
        return new Promise((resolve, reject) => {
            ClientModel.getClientById(id, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
    
    searchClientsMassive: (searchTerm, page, limit) => {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            ClientModel.searchClientsMassive(searchTerm, limit, offset, (err, results) => {
                if (err) {
                    return reject(err);
                }
                ClientModel.getTotalClients((err, total) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({ clients: results, totalItems: total });
                });
            });
        });
    },
    
};

module.exports = ClientService;





