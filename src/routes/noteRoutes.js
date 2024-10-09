const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/clientes/:clienteId/crear', noteController.addNote);
router.get('/clientes/:clienteId/buscar', noteController.getNotesByClient);

module.exports = router;
