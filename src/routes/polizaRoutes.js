const express = require('express');
const router = express.Router();
const polizaController = require('../controllers/polizaController');

router.post('/:cliente_id', polizaController.agregarPoliza); 
router.put('/editar/:id/:cliente_id', polizaController.editarPoliza); 
router.delete('/eliminar/:id', polizaController.eliminarPoliza); 
router.get('/cliente/:cliente_id', polizaController.obtenerPolizasPorCliente); 
router.get('/todas', polizaController.obtenerTodasPolizas); 
router.get('/buscar', polizaController.buscarPolizas);

module.exports = router;
