const db = require('../config/database');

const createPaymentTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS pagos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fecha_pago DATE NOT NULL,
            estado_pago VARCHAR(50) NOT NULL,
            emision_pago DECIMAL(10, 2) NOT NULL,
            poliza_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (poliza_id) REFERENCES polizas(id) ON DELETE CASCADE
        );
    `;

    try {
        await db.query(query);
        console.log('Tabla pagos verificada o creada correctamente');
    } catch (error) {
        console.error('Error al verificar/crear la tabla pagos:', error);
    }
};

createPaymentTable();

const Payment = {
    create: (paymentData, callback) => {
        const { fecha_pago, estado_pago, emision_pago, poliza_id } = paymentData;
        const query = `INSERT INTO pagos (fecha_pago, estado_pago, emision_pago, poliza_id) VALUES (?, ?, ?, ?)`;
        db.query(query, [fecha_pago, estado_pago, emision_pago, poliza_id], (err, result) => {
            if (err) return callback(err);
            const getLastPaymentQuery = `SELECT * FROM pagos WHERE id = LAST_INSERT_ID()`;
            db.query(getLastPaymentQuery, (err, rows) => {
                if (err) return callback(err);
                callback(null, rows[0]);
            });
        });
    },

    getPaymentsByPoliza: (polizaId, callback) => {
        const query = 'SELECT * FROM pagos WHERE poliza_id = ?';
        db.query(query, [polizaId], callback);
    },

    getTotalAmount: (callback) => {
        const query = 'SELECT SUM(emision_pago) AS total_amount FROM pagos';
        db.query(query, callback);
    }
};

module.exports = Payment;
