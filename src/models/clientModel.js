const db = require('../config/database');

const ClientModel = {
    addClient: (data, callback) => {
        const query = `
            INSERT INTO clientes (nombre, apellidos, telefono, contacto_emergencia, correo, fecha_nacimiento) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.query(query, [
            data.nombre,
            data.apellidos,
            data.telefono,
            data.contacto_emergencia,
            data.correo,
            data.fecha_nacimiento
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
    },
    
    searchClients: (searchTerm, callback) => {
        const query = `
            SELECT * FROM clientes
            WHERE nombre LIKE ? OR apellidos LIKE ? OR telefono LIKE ? OR contacto_emergencia LIKE ? OR correo LIKE ? OR fecha_nacimiento LIKE ?
        `;
        const likeSearchTerm = `%${searchTerm}%`;
        db.query(query, [
            likeSearchTerm, 
            likeSearchTerm, 
            likeSearchTerm, 
            likeSearchTerm, 
            likeSearchTerm, 
            likeSearchTerm
        ], callback);
    }
};

module.exports = ClientModel;


