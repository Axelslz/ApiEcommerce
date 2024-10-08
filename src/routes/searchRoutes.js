const express = require('express');
const router = express.Router();
const clientService = require('../services/clientService');
const polizaService = require('../services/polizaService');

const ITEMS_PER_PAGE = 5;

router.get('/clientes', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const { results, totalPages } = await clientService.getClientsPaginated(page);
        res.json({ results, totalPages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/polizas', async (req, res) => {
    try {
        const searchTerm = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const { polizas, totalPages } = await polizaService.buscarPolizas(searchTerm, 5, (page - 1) * 5);
        res.json({ polizas, totalPages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;

