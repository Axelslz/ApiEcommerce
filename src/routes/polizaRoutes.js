const express = require('express');
const router = express.Router();
const polizaController = require('../controllers/polizaController');
const { upload } = require('../config/cloudinary');

router.post('/clientes/:cliente_id/polizas', upload.single('archivo_pdf'), polizaController.agregarPoliza);
router.get('/polizas/:id', polizaController.obtenerPolizaPorId);
router.put('/clientes/:cliente_id/polizas/:id', polizaController.editarPoliza);
router.delete('/clientes/:cliente_id/polizas/:id', polizaController.eliminarPoliza);
router.get('/clientes/:cliente_id/polizas', polizaController.obtenerPolizasPorCliente);
router.get('/export-policies/:usuario_id', polizaController.downloadAllPolicies);
router.get('/polizas', polizaController.obtenerPolizasConDetalles);
router.get('/polizas/user/:user_id', polizaController.obtenerPolizasPorUsuario);
router.get('/user/:user_id/polizas/search', polizaController.buscarPolizasPorUsuario);

module.exports = router;
