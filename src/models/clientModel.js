const db = require('../config/database');

const Client = {
    addClient: (data, callback) => {
        const query = `
            INSERT INTO clientes (nombre, apellidos, telefono, contacto_emergencia, correo, fecha_nacimiento) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [
            data.nombre,
            data.apellidos,
            data.telefono,
            data.contacto_emergencia,
            data.correo,
            data.fecha_nacimiento,
        ], callback);
    },

    updateClient: (id, data, callback) => {
        const query = `
            UPDATE clientes SET 
                nombre = ?, 
                apellidos = ?, 
                telefono = ?, 
                contacto_emergencia = ?, 
                correo = ?, 
                fecha_nacimiento = ?, 
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        db.query(query, [
            data.nombre,
            data.apellidos,
            data.telefono,
            data.contacto_emergencia,
            data.correo,
            data.fecha_nacimiento,
            id
        ], callback);
    }
};

module.exports = Client;

