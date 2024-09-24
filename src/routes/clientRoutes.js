const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/clientController');

router.post('/', ClientController.createClient);
router.get('/:id', ClientController.getClientById);
router.put('/update/:id', ClientController.update);
router.delete('/delete/:id', ClientController.delete);

module.exports = router;
