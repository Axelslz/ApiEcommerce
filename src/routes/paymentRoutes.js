const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/polizas/:polizaId/pagos', paymentController.createPayment);
router.get('/polizas/:polizaId/pagos', paymentController.getPaymentsByPoliza);
router.get('/payments/total', paymentController.getTotalAmount);

module.exports = router;
