const clientService = require('../services/clientService');
const polizaService = require('../services/polizaService');

exports.searchClients = async (req, res) => {
    try {
        const query = req.query.q; 
        const clients = await clientService.searchClients(query);
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar clientes.' });
    }
};

exports.searchPolicies = async (req, res) => {
    try {
        const query = req.query.q; 
        const policies = await polizaService.searchPolicies(query);
        res.status(200).json(policies);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar pólizas.' });
    }
};

exports.search = async (req, res) => {
    const query = req.query.q || ''; 

    try {
        // Buscar en clientes
        const clients = await clientService.searchClients(query, 1); // Página 1
        // Buscar en pólizas
        const policies = await polizaService.buscarPolizas(query, 1, 5); // Página 1, 5 resultados

        res.status(200).json({
            clients: clients.clients, // Corregido para devolver los clientes
            policies: policies.policies, // Corregido para devolver las pólizas
            totalClients: clients.totalItems, // Totales para paginación
            totalPolicies: policies.totalItems,
        });
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        res.status(500).json({ error: error.message });
    }
};