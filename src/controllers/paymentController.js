const paymentService = require('../services/paymentService');

const paymentController = {
    createPayment: (req, res) => {
        const paymentData = {
            ...req.body,
            poliza_id: req.params.polizaId // Asignar polizaId desde la ruta
        };
        paymentService.createPayment(paymentData, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al crear el pago' });
            }
            const { paymentCreated, totalAmount } = result;
            res.status(201).json({
                message: 'Pago creado exitosamente',
                payment: paymentCreated,
                totalAmount: totalAmount[0].total_amount
            });
        });
    },

    getPaymentsByPoliza: (req, res) => {
        const polizaId = req.params.polizaId;
        paymentService.getPaymentsByPoliza(polizaId, (err, payments) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener pagos' });
            }
            res.status(200).json(payments);
        });
    },

    getTotalAmount: (req, res) => {
        paymentService.getTotalAmount((err, totalAmount) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener el monto total' });
            }
            res.status(200).json({ totalAmount: totalAmount[0].total_amount });
        });
    }
};

module.exports = paymentController;
