const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

const ITEMS_PER_PAGE = 5;

router.get('/clientes', searchController.searchClients);

router.get('/polizas', searchController.searchPolicies); 

router.get('/buscar', searchController.search);


module.exports = router; 

