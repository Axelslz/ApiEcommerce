const db = require('../config/database');

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
    }
};

