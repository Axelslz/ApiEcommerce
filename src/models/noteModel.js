const db = require('../config/database');

const NoteModel = {
    addNote: (clienteId, contenido, callback) => {
        const query = `INSERT INTO notas (cliente_id, contenido) VALUES (?, ?)`;
        db.query(query, [clienteId, contenido], (err, result) => {
            if (err) {
                console.error('Error al agregar la nota en el modelo:', err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    },

    getNotesByClient: (clienteId, callback) => {
        const query = `SELECT * FROM notas WHERE cliente_id = ? ORDER BY created_at DESC`;
        db.query(query, [clienteId], (err, results) => {
            if (err) {
                console.error('Error al obtener las notas en el modelo:', err);
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    }
};


module.exports = NoteModel;
