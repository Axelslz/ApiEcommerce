const express = require('express');
const router = express.Router();
const polizaController = require('../controllers/polizaController');

router.post('/', polizaController.agregarPoliza);
router.put('/:id', polizaController.editarPoliza);
router.delete('/:id', polizaController.eliminarPoliza);
router.get('/:id', polizaController.obtenerPolizaPorId);

module.exports = router;