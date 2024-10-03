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
};