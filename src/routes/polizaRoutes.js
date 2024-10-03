const express = require('express');
const router = express.Router();
const polizaController = require('../controllers/polizaController');

router.post('/polizas', polizaController.agregarPoliza);
router.put('/polizas/:id', polizaController.editarPoliza);
router.delete('/polizas/:id', polizaController.eliminarPoliza);
router.get('/polizas/:id', polizaController.obtenerPolizaPorId);

module.exports = router;