const express = require('express');
const router = express.Router();
const clientService = require('../services/clientService');
const polizaService = require('../services/polizaService');
const searchController = require('../controllers/searchController');

const ITEMS_PER_PAGE = 5;

router.get('/clientes', async (req, res) => {
    try {
        const searchTerm = req.query.q || '';
        const page = parseInt(req.query.page) || 1; 
        const { clients, totalItems } = await clientService.searchClients(searchTerm, page, ITEMS_PER_PAGE);
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); 

        res.json({
            clients,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/polizas', async (req, res) => {
    try {
        const searchTerm = req.query.q || '';
        const page = parseInt(req.query.page) || 1; 
        const { policies, totalItems } = await polizaService.buscarPolizas(searchTerm, page, ITEMS_PER_PAGE);
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); 

        res.json({
            policies,
            totalPages,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/buscar', searchController.search);

module.exports = router; 

