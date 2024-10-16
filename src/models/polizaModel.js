const db = require('../config/database');

const createPolizaTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS polizas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tipo_seguro VARCHAR(255),
            prima_neta DECIMAL(10, 2),
            asegurado VARCHAR(255),
            vigencia_de DATE,
            vigencia_hasta DATE,
            periodicidad_pago VARCHAR(255),
            archivo_pdf VARCHAR(255),
            cliente_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
        );
    `;

    try {
        await db.query(query);
        console.log('Tabla polizas verificada o creada correctamente');
    } catch (error) {
        console.error('Error al verificar/crear la tabla polizas:', error);
    }
};

createPolizaTable();

module.exports = {
    agregarPoliza: (data, callback) => {
        const query = 'INSERT INTO polizas SET ?';
        db.query(query, data, callback);
    },
    editarPoliza: (id, data, callback) => {
        const query = 'UPDATE polizas SET ? WHERE id = ?';
        db.query(query, [data, id], callback);
    },
    eliminarPoliza: (id, callback) => {
        const query = 'DELETE FROM polizas WHERE id = ?';
        db.query(query, [id], callback);
    },
    obtenerPolizaPorId: (id, callback) => {
        const sql = 'SELECT * FROM polizas WHERE id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]); 
        });
    },
    searchPolicies: (query, limit, offset, callback) => {
        const sql = `SELECT * FROM polizas WHERE tipo_seguro LIKE ? OR asegurado LIKE ? LIMIT ? OFFSET ?`;
        db.query(sql, [`%${query}%`, `%${query}%`, limit, offset], (err, results) => {
            callback(err, results);
        });
    },

    getTotalFilteredPolicies: (searchTerm, callback) => {
        const sql = `SELECT COUNT(*) AS total FROM polizas WHERE tipo_seguro LIKE ? OR asegurado LIKE ?`;
        db.query(sql, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
            callback(err, results[0].total);
        });
    },

    obtenerTodasPolizas: (limit, offset, callback) => {
        const query = 'SELECT * FROM polizas LIMIT ? OFFSET ?';
        db.query(query, [limit, offset], callback);
    },

    obtenerPolizasPorCliente: (cliente_id, limit, offset, callback) => {
        const query = 'SELECT * FROM polizas WHERE cliente_id = ? LIMIT ? OFFSET ?';
        db.query(query, [cliente_id, limit, offset], callback);
    },

    getTotalPoliciesByCliente: (cliente_id, callback) => {
        const query = 'SELECT COUNT(*) AS total FROM polizas WHERE cliente_id = ?';
        db.query(query, [cliente_id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].total);
        });
    },
    

    getTotalPolicies: (callback) => {
        const query = 'SELECT COUNT(*) AS total FROM polizas';
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].total);
        });
    },

    getAllPolicies: (limit, offset, callback) => {
        const query = 'SELECT * FROM polizas LIMIT ? OFFSET ?';
        db.query(query, [limit, offset], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    searchPoliciesMassive: (query, limit, offset, callback) => {
        const sql = `SELECT * FROM polizas WHERE tipo_seguro LIKE ? OR asegurado LIKE ? LIMIT ? OFFSET ?`;
        const searchTerm = `%${query}%`;
        db.query(sql, [searchTerm, searchTerm, limit, offset], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getPolicyByClientId: (clientId) => {
        const query = 'SELECT * FROM polizas WHERE client_id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [clientId], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve(results[0]);
            });
        });
    }


};


