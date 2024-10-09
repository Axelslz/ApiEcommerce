const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const clientMiddleware = require('../middlewares/clientMiddleware');

router.post('/agregar', clientMiddleware, clientController.addClient);
router.put('/editar/:id', clientMiddleware, clientController.updateClient);
router.get('/obtener', clientController.getClients);
router.get('/obtener/:id', clientController.getClientById);  

module.exports = router;

