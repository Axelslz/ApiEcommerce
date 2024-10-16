const ClientModel = require('../models/clientModel');

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

    searchClients: async (searchTerm, user_id, page, limit = 5) => {
        const offset = (page - 1) * limit;

        const clients = await ClientModel.searchClients(searchTerm, user_id, limit, offset);
        const total = await ClientModel.getTotalClientsBySearch(searchTerm, user_id);

        return { clients, total, totalPages: Math.ceil(total / limit) };
    },

    getClientsPaginated: async (user_id, page = 1, limit = 5) => {
        const offset = (page - 1) * limit;

        try {
            const totalClients = await ClientModel.getTotalClientsByUserId(user_id); // Filtrando por user_id
            const totalPages = Math.ceil(totalClients / limit);
            const clients = await ClientModel.getClientsPaginated(user_id, limit, offset);

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

    buscarClientes: async (searchTerm, limit, offset) => {
        try {
            const clientes = await ClientModel.buscarClientes(searchTerm, limit, offset);
            const total = await ClientModel.getTotalClientesBySearch(searchTerm);
            const totalPages = Math.ceil(total / limit);

            return { clientes, totalPages };
        } catch (error) {
            throw new Error('Error al buscar clientes');
        }
    },
};

module.exports = ClientService;







