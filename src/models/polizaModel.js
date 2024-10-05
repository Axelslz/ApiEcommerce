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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        const query = 'SELECT * FROM polizas WHERE id = ?';
        db.query(query, id, callback);
    },
    searchPolicies: (searchTerm, callback) => {
        const query = `
            SELECT * FROM polizas
            WHERE tipo_seguro LIKE ? OR prima_neta LIKE ? OR asegurado LIKE ?
            OR vigencia_de LIKE ? OR vigencia_hasta LIKE ? OR periodicidad_pago LIKE ?
            OR archivo_pdf LIKE ?
        `;
        const likeSearchTerm = `%${searchTerm}%`;
        db.query(query, [
            likeSearchTerm, likeSearchTerm, likeSearchTerm, 
            likeSearchTerm, likeSearchTerm, likeSearchTerm, 
            likeSearchTerm
        ], callback);
    },

    obtenerTodasPolizas: (limit, offset, callback) => {
        const query = 'SELECT * FROM polizas LIMIT ? OFFSET ?';
        db.query(query, [limit, offset], callback);
    }
};

