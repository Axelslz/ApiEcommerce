const db = require('../config/database');

const createClientTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS clientes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            apellidos VARCHAR(255) NOT NULL,
            telefono VARCHAR(20),
            contacto_emergencia VARCHAR(20),
            correo VARCHAR(255) NOT NULL UNIQUE,
            fecha_nacimiento DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await db.query(query);
        console.log('Tabla clientes verificada o creada correctamente');
    } catch (error) {
        console.error('Error al verificar/crear la tabla clientes:', error);
    }
};

createClientTable();

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
    },
    
    getClientsPaginated: (limit, offset, callback) => {
        const query = `
            SELECT * FROM clientes
            LIMIT ? OFFSET ?
        `;
        db.query(query, [limit, offset], callback);
    },

    getTotalClients: (callback) => {
        const query = 'SELECT COUNT(*) AS total FROM clientes';
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].total);
        });
    }, 
    getClientById: (id, callback) => {
        const query = `
            SELECT id, nombre, apellidos, telefono, contacto_emergencia, correo, fecha_nacimiento
            FROM clientes
            WHERE id = ?
        `;
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);  
        });
    },
    searchClientsMassive: (searchTerm, limit, offset, callback) => {
        const query = `
            SELECT * FROM clientes
            WHERE nombre LIKE ? OR apellidos LIKE ? OR telefono LIKE ? 
            OR contacto_emergencia LIKE ? OR correo LIKE ? OR fecha_nacimiento LIKE ?
            LIMIT ? OFFSET ?
        `;
        const likeSearchTerm = `%${searchTerm}%`;
        db.query(query, [
            likeSearchTerm, 
            likeSearchTerm, 
            likeSearchTerm, 
            likeSearchTerm, 
            likeSearchTerm, 
            likeSearchTerm,
            limit, 
            offset
        ], callback);
    },
    
};

module.exports = ClientModel;



