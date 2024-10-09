const noteService = require('../services/noteService');

exports.addNote = async (req, res) => {
    try {
        const clienteId = req.params.clienteId;
        const { contenido } = req.body;

        if (!contenido) {
            return res.status(400).json({ error: 'El contenido de la nota es requerido' });
        }

        const result = await noteService.addNote(clienteId, contenido);
        if (result && result.insertId) {
            res.status(201).json({ message: 'Nota agregada exitosamente', noteId: result.insertId });
        } else {
            res.status(400).json({ error: 'No se pudo agregar la nota' });
        }
    } catch (error) {
        console.error("Error al agregar la nota:", error);
        res.status(500).json({ error: 'Error al agregar la nota. Por favor, intenta de nuevo.' });
    }
};

exports.getNotesByClient = async (req, res) => {
    try {
        const clienteId = req.params.clienteId;
        const notes = await noteService.getNotesByClient(clienteId);
        if (notes.length > 0) {
            res.status(200).json(notes);
        } else {
            res.status(404).json({ message: 'No se encontraron notas para este cliente' });
        }
    } catch (error) {
        console.error("Error al obtener las notas:", error);
        res.status(500).json({ error: 'Error al obtener las notas. Por favor, intenta de nuevo.' });
    }
};
