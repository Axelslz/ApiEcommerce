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
    },
     
    getPagosPorUsuarioPaginado: (userId, limit, offset) => {
        const query = `
            SELECT p.asegurado AS nombre_asegurado, pa.monto, pa.fecha_pago, pa.status, pa.created_at AS emision_pago
            FROM polizas p
            JOIN pagos pa ON p.id = pa.poliza_id
            JOIN clientes c ON p.cliente_id = c.id
            WHERE c.user_id = ?
            GROUP BY p.id
            ORDER BY pa.fecha_pago DESC
            LIMIT ? OFFSET ?;`; 

        return new Promise((resolve, reject) => {
            db.query(query, [userId, limit, offset], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getTotalPaginas: (userId) => {
        const countQuery = `
            SELECT COUNT(DISTINCT p.id) AS total_policies
            FROM polizas p
            JOIN clientes c ON p.cliente_id = c.id
            WHERE c.user_id = ?;`; 

        return new Promise((resolve, reject) => {
            db.query(countQuery, [userId], (err, result) => {
                if (err) return reject(err);
                const totalPages = Math.ceil(result[0].total_policies / 5); 
                resolve(totalPages);
            });
        });
    },

    obtenerPolizaPorID: (poliza_id) => {
        const query = `SELECT prima_neta, periodicidad_pago FROM polizas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.query(query, [poliza_id], (err, results) => {
                if (err) return reject(err);
                console.log('Resultado de la póliza:', results); // Agrega este log
                resolve(results.length > 0 ? results[0] : null);
            });
        });
    },

    obtenerPolizaPorIDPaginado: async (poliza_id, limit = 5, offset = 0) => {
        try {
            const poliza = await PagoModel.obtenerPolizaPorID(poliza_id);
            const pagos = await PagoModel.obtenerPagosPorPolizaPaginado(poliza_id, limit, offset);
            const totalPagos = await PagoModel.contarPagosPorPoliza(poliza_id);
            const totalPages = Math.ceil(totalPagos / limit);
            
            return { 
                poliza, 
                pagos, 
                totalPages 
            };
        } catch (error) {
            throw new Error('Error al obtener la póliza y pagos paginados');
        }
    },
    

};

module.exports = PagoModel;


