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
            user_id INT NOT NULL,  
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
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
    createClient: (data) => {
        const query = `
            INSERT INTO clientes (nombre, apellidos, telefono, contacto_emergencia, correo, fecha_nacimiento, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [
                data.nombre,
                data.apellidos,
                data.telefono,
                data.contacto_emergencia,
                data.correo,
                data.fecha_nacimiento,
                data.user_id 
            ], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    updateClient: (id, data) => {
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
        return new Promise((resolve, reject) => {
            db.query(query, [
                data.nombre,
                data.apellidos,
                data.telefono,
                data.contacto_emergencia,
                data.correo,
                data.fecha_nacimiento,
                id
            ], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    getClientsByUserId: (userId, limit = 5, offset = 0) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM clientes WHERE user_id = ? LIMIT ? OFFSET ?`;
            db.query(sql, [userId, limit, offset], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    
    
    getTotalClientsByUserId: (userId) => {
        const query = 'SELECT COUNT(*) AS total FROM clientes WHERE user_id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0].total);
            });
        });
    },

    obtenerClientePorId: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM clientes WHERE id = ?';
            db.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null); 
                resolve(results[0]); 
            });
        });
    }, 

    searchClients: (searchTerm, limit, offset) => {
        if (!searchTerm || limit <= 0 || offset < 0) {
            return Promise.reject(new Error("Faltan parámetros para la búsqueda de clientes"));
        }
    
        const query = `
            SELECT * FROM clientes
            WHERE (nombre LIKE ? OR apellidos LIKE ? OR telefono LIKE ? OR correo LIKE ?)
            LIMIT ? OFFSET ?
        `;
        const likeSearchTerm = `%${searchTerm}%`;
    
        return new Promise((resolve, reject) => {
            db.query(query, [
                likeSearchTerm, likeSearchTerm, likeSearchTerm, likeSearchTerm, 
                limit, offset
            ], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },    
    
    getTotalClientsBySearch: async (searchTerm) => {
        const query = `
            SELECT COUNT(*) AS total FROM clientes
            WHERE nombre LIKE ? OR apellidos LIKE ? OR telefono LIKE ? OR correo LIKE ?
        `;
        const likeSearchTerm = `%${searchTerm}%`;
    
        return new Promise((resolve, reject) => {
            db.query(query, [likeSearchTerm, likeSearchTerm, likeSearchTerm, likeSearchTerm], (err, results) => {
                if (err) return reject(err);
                resolve(results[0].total);  // Retorna el total
            });
        });
    },

};

module.exports = ClientModel;


  //  searchClientsMassive: (searchTerm, limit, offset) => {
   //     const query = `
   //         SELECT * FROM clientes
   //         WHERE nombre LIKE ? OR apellidos LIKE ? OR telefono LIKE ? 
  //          OR contacto_emergencia LIKE ? OR correo LIKE ? OR fecha_nacimiento LIKE ?
   //         LIMIT ? OFFSET ?
   //     `;
    //    const likeSearchTerm = `%${searchTerm}%`;
      //  return new Promise((resolve, reject) => {
        //    db.query(query, [
          //      likeSearchTerm, 
            //    likeSearchTerm, 
              //  likeSearchTerm, 
              //  likeSearchTerm, 
               // likeSearchTerm, 
               // likeSearchTerm,
                //limit, 
                //offset
           // ], (err, results) => {
             //   if (err) return reject(err);
              //  resolve(results);
           // });
        //});
  //  }, 
    
   






