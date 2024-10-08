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
    },

    getClientsPaginated: (page) => {
        return new Promise((resolve, reject) => {
            const limit = 5;  // 5 clientes por página
            const offset = (page - 1) * limit;  // Calcular el offset
            
            // Obtener los clientes paginados
            ClientModel.getClientsPaginated(limit, offset, (err, results) => {
                if (err) {
                    return reject(err);
                }
    
                // Obtener el total de clientes
                ClientModel.getTotalClients((err, total) => {
                    if (err) {
                        return reject(err);
                    }
                    
                    // Calcular el total de páginas
                    const totalPages = Math.ceil(total / limit);
                    resolve({ results, totalPages });
                });
            });
        });
    }
};

module.exports = ClientService;





