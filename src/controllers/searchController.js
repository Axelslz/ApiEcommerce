const clientService = require('../services/clientService');
const PolizaService = require('../services/polizaService');

exports.searchClients = async (req, res) => {
    try {
        const searchTerm = req.query.q || ''; // Parámetro de búsqueda
        const page = parseInt(req.query.page) || 1; // Página actual

        const result = await clientService.getClientsBySearchPaginated(searchTerm, page);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error en el controlador de búsqueda de clientes:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.searchPolicies = async (req, res) => {
    const { searchTerm, page, limit } = req.query;

    try {
        const result = await PolizaService.getPoliciesBySearchPaginated(searchTerm, page, limit);

        // Si no hay pólizas y la página está fuera de rango
        if (result.policies.length === 0 && page > result.totalPages) {
            return res.status(404).json({
                message: `No se encontraron más resultados en la página ${page}.`
            });
        }

        // Retornar el resultado de la búsqueda
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.search = async (req, res) => {
    const query = req.query.q || ''; 
    const page = parseInt(req.query.page) || 1;
    const ITEMS_PER_PAGE = 5;

    try {
        // Buscar clientes con paginación
        const clients = await clientService.searchClients(query, page, ITEMS_PER_PAGE);
        // Buscar pólizas con paginación
        const policies = await polizaService.searchPolicies(query, page, ITEMS_PER_PAGE);

        res.status(200).json({
            clients: clients.clients,  // Devuelve clientes paginados
            policies: policies.policies,  // Devuelve pólizas paginadas
            totalClients: clients.totalItems,  // Total para paginación de clientes
            totalPolicies: policies.totalItems,  // Total para paginación de pólizas
            currentPage: page,
            totalPagesClients: Math.ceil(clients.totalItems / ITEMS_PER_PAGE),  // Total de páginas de clientes
            totalPagesPolicies: Math.ceil(policies.totalItems / ITEMS_PER_PAGE),  // Total de páginas de pólizas
        });
    } catch (error) {
        console.error("Error en la búsqueda:", error);
        res.status(500).json({ error: error.message });
    }
};