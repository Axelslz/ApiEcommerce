const express = require('express');
const router = express.Router();
const polizaController = require('../controllers/polizaController');
const { upload } = require('../config/cloudinary');

router.post('/clientes/:cliente_id/polizas', upload.single('archivo_pdf'), polizaController.agregarPoliza);
router.get('/polizas/:id', polizaController.obtenerPolizaPorId);
router.put('/clientes/:cliente_id/polizas/:id', polizaController.editarPoliza);
router.delete('/clientes/:cliente_id/polizas/:id', polizaController.eliminarPoliza);
router.get('/polizas', polizaController.obtenerTodasPolizas);
router.get('/clientes/:cliente_id/polizas', polizaController.obtenerPolizasPorCliente);
router.get('/clientes/:cliente_id/polizas/buscar', polizaController.buscarPolizas);
router.get('/clientes/:cliente_id/polizas/total', polizaController.getTotalPoliciesByCliente);
router.get('/polizas/total', polizaController.getTotalPolicies);
router.get('/export-policies/:usuario_id', polizaController.downloadAllPolicies);
router.get('/polizas', polizaController.obtenerPolizasConDetalles);

module.exports = router;
