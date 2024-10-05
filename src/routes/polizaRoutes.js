const express = require('express');
const router = express.Router();
const polizaController = require('../controllers/polizaController');

router.post('/', polizaController.agregarPoliza);
router.put('/editar/:id', polizaController.editarPoliza);
router.delete('/delate/:id', polizaController.eliminarPoliza);
router.get('/obtener/:id', polizaController.obtenerPolizaPorId);
router.get('/todas', polizaController.obtenerTodasPolizas);

module.exports = router;