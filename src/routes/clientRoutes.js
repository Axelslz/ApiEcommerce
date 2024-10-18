const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/:usuario_id/agregar', clientController.addClient);
router.put('/:usuario_id/editar/:id', clientController.updateClient);
router.get('/:usuario_id', clientController.getClientsByUserId);
router.get('/:usuario_id/:id', clientController.getClientById);
router.get('/:usuario_id/buscar', clientController.searchClients);
router.get('/:usuario_id/exportar/todos', clientController.downloadAllClients);


module.exports = router;


