const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const clientMiddleware = require('../middlewares/clientMiddleware');

router.post('/agregar', clientMiddleware, clientController.addClient);
router.put('/editar/:id', clientMiddleware, clientController.updateClient);

module.exports = router;

