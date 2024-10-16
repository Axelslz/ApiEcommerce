const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

router.post('/polizas/:poliza_id/generar-pagos', pagoController.agregarPagoAutomatico);
router.get('/polizas/:poliza_id/pagos', pagoController.obtenerPagosPorPoliza);

module.exports = router;


