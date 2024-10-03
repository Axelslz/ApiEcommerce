const express = require('express');
const router = express.Router();
const clientService = require('../services/clientService');
const polizaService = require('../services/polizaService');

router.get('/clientes', async (req, res) => {
    try {
        const searchTerm = req.query.q; 
        const clients = await clientService.searchClients(searchTerm);
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/polizas', async (req, res) => {
    try {
        const searchTerm = req.query.q; 
        const policies = await polizaService.searchPolicies(searchTerm);
        res.json(policies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

