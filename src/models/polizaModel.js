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

    searchPolicies(searchTerm, limit, offset) {
        // Validación de parámetros
        if (limit <= 0 || offset < 0) {
            return Promise.reject(new Error("Faltan parámetros para la búsqueda de pólizas"));
        }
    
        const query = `
            SELECT * FROM polizas
            WHERE (tipo_seguro LIKE ? OR asegurado LIKE ? OR prima_neta LIKE ?)
            LIMIT ? OFFSET ?
        `;
        const likeSearchTerm = `%${searchTerm || ''}%`;  // Si searchTerm está vacío, busca todo
    
        return new Promise((resolve, reject) => {
            db.query(query, [
                likeSearchTerm, likeSearchTerm, likeSearchTerm,
                limit, offset
            ], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    
    
    getTotalPoliciesBySearch(searchTerm) {
        const query = `
            SELECT COUNT(*) AS total FROM polizas 
            WHERE (tipo_seguro LIKE ? OR asegurado LIKE ? OR vigencia_hasta LIKE ? OR prima_neta LIKE ? OR archivo_pdf LIKE ?)
        `;
        const likeTerm = `%${searchTerm}%`;
    
        return new Promise((resolve, reject) => {
            db.query(query, [
                likeTerm, likeTerm, likeTerm,
                likeTerm, likeTerm
            ], (err, results) => {
                if (err) return reject(err);
                resolve(results[0].total);  // Retorna el total
            });
        });
    },
    
    getTotalFilteredPolicies: (searchTerm, callback) => {
        const sql = `SELECT COUNT(*) AS total FROM polizas WHERE tipo_seguro LIKE ? OR asegurado LIKE ?`;
        db.query(sql, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
            callback(err, results[0].total);
        });
    },

    getTotalPolicies: (callback) => {
        const query = 'SELECT COUNT(*) AS total FROM polizas';
        db.query(query, callback);
    },
    
    obtenerTodasPolizas: (limit, offset, callback) => {
        const query = 'SELECT * FROM polizas LIMIT ? OFFSET ?';
        db.query(query, [limit, offset], callback);
    },
    

    obtenerPolizasPorCliente: (cliente_id, limit, offset, callback) => {
        let query = 'SELECT * FROM polizas WHERE cliente_id = ?';
        let params = [cliente_id];
    
        // Solo agregar LIMIT y OFFSET si existen valores válidos
        if (typeof limit === 'number' && typeof offset === 'number') {
            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }
    
        db.query(query, params, callback);
    },
    
    obtenerPolizasConDetalles: (limit, offset, callback) => {
        const query = `
            SELECT p.id, p.tipo_seguro, p.aseguradora, p.asegurado, p.vigencia_hasta,
                   c.nombre, c.apellidos
            FROM polizas p
            INNER JOIN clientes c ON p.cliente_id = c.id
            ORDER BY p.id
            LIMIT ? OFFSET ?;
        `;
    
        const params = [limit, offset];
    
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                return callback(err, null);
            }
    
            console.log('Resultados de la consulta SQL:', results); // Log para verificar resultados
            callback(null, results);
        });
    },

   obtenerPolizas: (limit, offset, callback) => {
        const query = `
            SELECT id, tipo_seguro, aseguradora, asegurado, vigencia_hasta, cliente_id
            FROM polizas
            ORDER BY id
            LIMIT ? OFFSET ?;
        `;

        const params = [limit, offset];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL:', err);
                return callback(err, null);
            }

            console.log('Resultados de las pólizas:', results);
            callback(null, results);
        });
    },

    obtenerNombresYApellidos: (clienteId, callback) => {
        const query = `
            SELECT nombre, apellidos
            FROM clientes
            WHERE id = ?;
        `;

        db.query(query, [clienteId], (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL para nombres y apellidos:', err);
                return callback(err, null);
            }

            console.log('Resultados de nombres y apellidos:', results);
            callback(null, results[0]); // Retorna el primer resultado
        });
    },

    obtenerPolizasPorUsuario: (user_id, callback) => {
        const query = `
            SELECT p.* 
            FROM polizas p
            JOIN clientes c ON p.cliente_id = c.id
            WHERE c.user_id = ?
        `;
        db.query(query, [user_id], callback);
    },

    getTotalPoliciesByCliente: (cliente_id, callback) => {
        const query = 'SELECT COUNT(*) AS total FROM polizas WHERE cliente_id = ?';
        db.query(query, [cliente_id], (err, results) => {
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
    },

    obtenerPolizasPorUsuario: (user_id, limit, offset, callback) => {
        let query = `
            SELECT p.*
            FROM polizas p
            INNER JOIN clientes c ON p.cliente_id = c.id
            WHERE c.user_id = ?
            LIMIT ? OFFSET ?`;
    
        db.query(query, [user_id, limit, offset], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    
    getTotalPoliciesByUser: (user_id, callback) => {
        const query = `
            SELECT COUNT(*) AS total 
            FROM polizas p
            JOIN clientes c ON p.cliente_id = c.id
            WHERE c.user_id = ?`;
    
        db.query(query, [user_id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].total);
        });
    },

    

    
};


