const NoteModel = require('../models/noteModel');

const NoteService = {
    addNote: (clienteId, contenido) => {
        return new Promise((resolve, reject) => {
            NoteModel.addNote(clienteId, contenido, (err, result) => {
                if (err) {
                    console.error('Error al agregar la nota en el servicio:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    getNotesByClient: (clienteId) => {
        return new Promise((resolve, reject) => {
            NoteModel.getNotesByClient(clienteId, (err, results) => {
                if (err) {
                    console.error('Error al obtener las notas en el servicio:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
};

module.exports = NoteService;
