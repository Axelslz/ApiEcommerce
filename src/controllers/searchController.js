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
