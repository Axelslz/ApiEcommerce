const ClientModel = require('../models/clientModel');

const ITEMS_PER_PAGE = 5;

const ClientService = {
    addClient: async (data) => {
        try {
            const result = await ClientModel.createClient(data);
            return result;
        } catch (error) {
            throw new Error("Error al agregar cliente: " + error.message);
        }
    },

    updateClient: async (id, data) => {
        try {
            const result = await ClientModel.updateClient(id, data);
            return result;
        } catch (error) {
            throw new Error("Error al actualizar cliente: " + error.message);
        }
    },

    getClientsPaginated: async (user_id, page = 1, limit = 5) => {
        const offset = (page - 1) * limit;
    
        try {
            // Obtener el total de clientes del usuario
            const totalClients = await ClientModel.getTotalClientsByUserId(user_id);
            const totalPages = Math.ceil(totalClients / limit);
            
            // Obtener los clientes con la paginación
            const clients = await ClientModel.getClientsByUserId(user_id, limit, offset);
    
            return {
                clients,
                totalPages: totalPages || 1, // Al menos una página si no hay resultados
                totalItems: totalClients,
                currentPage: page,
                limit
            };
        } catch (error) {
            throw new Error("Error al obtener clientes paginados: " + error.message);
        }
    },
 
    getClientsBySearchPaginated: async (searchTerm, page = 1, limit = 5) => {
        const offset = (page - 1) * limit;
    
        try {
            // Verifica que el offset no sea negativo
            if (offset < 0) {
                throw new Error("El número de página no puede ser menor que 1");
            }
    
            // Total de clientes para la paginación
            const totalClients = await ClientModel.getTotalClientsBySearch(searchTerm);
            const totalPages = Math.ceil(totalClients / limit);
            
            // Clientes paginados
            const clients = await ClientModel.searchClients(searchTerm, limit, offset);
    
            return {
                clients,
                totalPages: totalPages || 1,  // Al menos una página
                totalItems: totalClients,
                currentPage: page,
                limit
            };
        } catch (error) {
            throw new Error("Error al obtener clientes paginados por búsqueda: " + error.message);
        }
    },
    
    
    getClientsPaginated: async (user_id, searchTerm = '', page = 1, limit = 5) => {
        const offset = (page - 1) * limit;
    
        try {
            const totalClients = await ClientModel.getTotalClientsBySearch(searchTerm, user_id); // Filtrar por término y user_id
            const totalPages = Math.ceil(totalClients / limit);
            const clients = await ClientModel.searchClients(user_id, searchTerm, limit, offset);
    
            return {
                clients,
                totalPages,
                totalItems: totalClients,
                currentPage: page,
                limit
            };
        } catch (error) {
            throw new Error("Error al obtener clientes paginados: " + error.message);
        }
    },


    getClientById: async (id) => { 
        try {
            const client = await ClientModel.obtenerClientePorId(id); 
            return client;
        } catch (error) {
            throw new Error("Error al obtener cliente: " + error.message);
        }
    },

    searchClientsMassive: async (searchTerm, user_id, page, limit) => {
        const offset = (page - 1) * limit;

        try {
            const clients = await ClientModel.searchClientsMassive(searchTerm, user_id, limit, offset);
            const total = await ClientModel.getTotalClients(user_id);

            return { clients, totalItems: total };
        } catch (error) {
            throw new Error("Error en la búsqueda masiva de clientes: " + error.message);
        }
    },

    getClientsByUserId: async (userId, limit = 5, offset = 0) => {
        const clients = await ClientModel.getClientsByUserId(userId, limit, offset);
        const totalClients = await ClientModel.getTotalClientsByUserId(userId);
        const totalPages = Math.ceil(totalClients / limit);

        return { clients, totalPages };
    },

    obtenerClientes: async (limit, offset) => {
        try {
            const clientes = await ClientModel.obtenerClientes(limit, offset);
            return clientes;
        } catch (error) {
            throw new Error('Error al obtener clientes paginados');
        }
    },

    getTotalClientes: async () => {
        try {
            const total = await ClientModel.getTotalClientes();
            return total;
        } catch (error) {
            throw new Error('Error al obtener el total de clientes');
        }
    },


    getAllDownloadByUserId: async (userId) => {
        try {
            const clients = await ClientModel.getClientsByUserId(userId, 1000000, 0); // Usar un número grande
            return clients;
        } catch (error) {
            throw new Error("Error al obtener todos los clientes: " + error.message);
        }
    },
    
};

module.exports = ClientService;







