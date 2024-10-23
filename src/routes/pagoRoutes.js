const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

router.get('/polizas/:poliza_id/pagos', pagoController.obtenerPagosPorPoliza);
router.get('/todos/pagos', pagoController.obtenerTodosLosPagos);
router.get('/poliza/:poliza_id', pagoController.obtenerPagosPorPolizaPorID);

module.exports = router;


