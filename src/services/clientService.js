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

    searchClients: (searchTerm, user_id, page) => { // Añadimos user_id aquí
        return new Promise((resolve, reject) => {
            const limit = 5; 
            const offset = (page - 1) * limit; 
            
            ClientModel.searchClients(searchTerm, user_id, (err, results) => { // Añadimos user_id aquí
                if (err) {
                    return reject(err);
                }
                ClientModel.getTotalClients(user_id, (err, total) => {  // Añadimos user_id aquí
                    if (err) {
                        return reject(err);
                    }
                    resolve({ clients: results, totalItems: total });
                });
            });
        });
    },

    getClientsPaginated: (user_id, page) => { // Añadimos user_id aquí
        return new Promise((resolve, reject) => {
            const limit = 5;  
            const offset = (page - 1) * limit;  
            ClientModel.getClientsPaginated(user_id, limit, offset, (err, results) => { // Añadimos user_id aquí
                if (err) {
                    return reject(err);
                }
                ClientModel.getTotalClients(user_id, (err, total) => {  // Añadimos user_id aquí
                    if (err) {
                        return reject(err);
                    }
                    const totalPages = Math.ceil(total / limit);
                    resolve({ results, totalPages });
                });
            });
        });
    },

    getClientById: (user_id, id) => { // Añadimos user_id aquí
        return new Promise((resolve, reject) => {
            ClientModel.getClientById(user_id, id, (err, result) => {  // Añadimos user_id aquí
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
    
    searchClientsMassive: (searchTerm, user_id, page, limit) => { // Añadimos user_id aquí
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            ClientModel.searchClientsMassive(searchTerm, user_id, limit, offset, (err, results) => { // Añadimos user_id aquí
                if (err) {
                    return reject(err);
                }
                ClientModel.getTotalClients(user_id, (err, total) => {  // Añadimos user_id aquí
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






