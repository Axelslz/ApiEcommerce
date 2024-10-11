const Payment = require('../models/paymentModel');

const paymentService = {
    createPayment: (paymentData, callback) => {
        Payment.create(paymentData, (err, paymentCreated) => {
            if (err) return callback(err);
            Payment.getTotalAmount((err, totalAmount) => {
                if (err) return callback(err);
                callback(null, { paymentCreated, totalAmount });
            });
        });
    },

    getPaymentsByPoliza: (polizaId, callback) => {
        Payment.getPaymentsByPoliza(polizaId, callback);
    },

    getTotalAmount: (callback) => {
        Payment.getTotalAmount(callback);
    }
};

module.exports = paymentService;
