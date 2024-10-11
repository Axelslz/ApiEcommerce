const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Ruta para agregar un cliente asociado a un usuario
router.post('/:usuario_id/agregar', clientController.addClient);

// Ruta para editar un cliente específico de un usuario
router.put('/:usuario_id/editar/:id', clientController.updateClient);

// Ruta para obtener todos los clientes de un usuario específico
router.get('/:usuario_id', clientController.getClientsByUserId);

// Ruta para obtener un solo cliente de un usuario específico
router.get('/:usuario_id/:id', clientController.getClientById);

// Ruta para buscar clientes de un usuario específico
router.get('/:usuario_id/buscar', clientController.buscarClientes);

module.exports = router;


