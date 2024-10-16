const db = require('../config/database');

const createPagoTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS pagos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            monto DECIMAL(10, 2) NOT NULL,
            fecha_pago DATE NOT NULL,
            poliza_id INT NOT NULL,
            status VARCHAR(50) DEFAULT 'pendiente',
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

createPagoTable();

const PagoModel = {
    createPago: (data) => {
        const query = 'INSERT INTO pagos (monto, fecha_pago, poliza_id, status) VALUES (?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [data.monto, data.fecha_pago, data.poliza_id, data.status], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    obtenerPagosPorPolizaPaginado: (poliza_id, limit, offset) => {
        const query = 'SELECT * FROM pagos WHERE poliza_id = ? LIMIT ? OFFSET ?';
        return new Promise((resolve, reject) => {
            db.query(query, [poliza_id, limit, offset], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    contarPagosPorPoliza: (poliza_id) => {
        const query = 'SELECT COUNT(*) AS total FROM pagos WHERE poliza_id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [poliza_id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0].total);
            });
        });
    }
};

module.exports = PagoModel;


