const Poliza = require('../models/polizaModel');
const ClientModel = require('../models/clientModel');

class PolizaService {
    static agregarPoliza(data) {
        return new Promise((resolve, reject) => {
            Poliza.agregarPoliza(data, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static async editarPoliza(id, cliente_id, data) {
        return new Promise((resolve, reject) => {
            Poliza.obtenerPolizaPorId(id, (err, poliza) => {
                if (err) return reject(err);
                if (!poliza) {
                    return reject(new Error('No se encontró la póliza con el ID especificado.'));
                }
    
                const polizaClienteId = poliza.cliente_id; 
                const inputClienteId = parseInt(cliente_id, 10);
    
                if (!polizaClienteId) {
                    return reject(new Error('El cliente_id de la póliza no es válido.'));
                }
    
                const polizaClienteIdParsed = parseInt(polizaClienteId, 10); 
    
                console.log(`Comparando cliente_id: poliza(${polizaClienteIdParsed}) vs entrada(${inputClienteId})`); // Logging para depuración
    
                if (polizaClienteIdParsed !== inputClienteId) {
                    return reject(new Error('Esta póliza no pertenece al cliente especificado.'));
                }
                
                Poliza.editarPoliza(id, data, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });
    }

    static eliminarPoliza(id) {
        return new Promise((resolve, reject) => {
            Poliza.eliminarPoliza(id, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    static obtenerPolizaPorId(id) {
        return new Promise((resolve, reject) => {
            Poliza.obtenerPolizaPorId(id, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static async buscarPolizasPorCliente(cliente_id, searchTerm, limit, offset) {
        
        const cliente = await ClientModel.obtenerClientePorId(cliente_id);
        if (!cliente) {
            throw new Error('El cliente especificado no existe.');
        }

        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM polizas WHERE cliente_id = ? AND (tipo_seguro LIKE ? OR asegurado LIKE ?) LIMIT ? OFFSET ?`;
            const searchTermFormatted = `%${searchTerm}%`;

            Poliza.db.query(sql, [cliente_id, searchTermFormatted, searchTermFormatted, limit, offset], (err, results) => {
                if (err) return reject(err);

                Poliza.getTotalFilteredPolicies(searchTermFormatted, (err, total) => {
                    if (err) return reject(err);
                    const totalPages = Math.ceil(total / limit);
                    resolve({ policies: results, totalPages });
                });
            });
        });
    }

    static obtenerTodasPolizas(limit, offset) {
        return new Promise((resolve, reject) => {
            Poliza.obtenerTodasPolizas(limit, offset, (err, results) => {
                if (err) return reject(err);
    
                Poliza.getTotalPolicies((err, totalResult) => {
                    if (err) return reject(err);
                    const total = totalResult[0]?.total || 0;
                    const totalPages = Math.ceil(total / limit);
                    resolve({ polizas: results, totalPages });
                });
            });
        });
    }    
    
    static getTotalPoliciesByUser(userId, callback) {
        const query = `
            SELECT COUNT(*) AS total 
            FROM polizas p
            JOIN clientes c ON p.cliente_id = c.id
            WHERE c.user_id = ?`;
        db.query(query, [userId], callback);
    }

    static obtenerPolizasPorCliente(cliente_id, limit, offset) {
        return new Promise((resolve, reject) => {
            // Asegurarse de que limit y offset sean números o undefined
            limit = typeof limit === 'number' ? limit : undefined;
            offset = typeof offset === 'number' ? offset : undefined;
    
            Poliza.obtenerPolizasPorCliente(cliente_id, limit, offset, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    
    static obtenerPolizasPorUsuario(usuario_id) {
        return new Promise((resolve, reject) => {
            Poliza.obtenerPolizasPorUsuario(usuario_id, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }    

    static getTotalPoliciesByCliente(cliente_id) {
        return new Promise((resolve, reject) => {
            Poliza.getTotalPoliciesByCliente(cliente_id, (err, total) => {
                if (err) return reject(err);
                resolve(total);
            });
        });
    }

    static actualizarPolizaArchivo(id, archivo_pdf_url) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE polizas SET archivo_pdf = ? WHERE id = ?';
            Poliza.db.query(sql, [archivo_pdf_url, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static obtenerPolizasConDetalles(limit, offset) {
        return new Promise((resolve, reject) => {
            Poliza.obtenerPolizas(limit, offset, (err, polizas) => {
                if (err) {
                    console.error('Error en PolizaService al obtener pólizas:', err);
                    return reject(err);
                }

                const polizasConDetalles = [];
                let promises = polizas.map(poliza => {
                    return new Promise((resolve, reject) => {
                        Poliza.obtenerNombresYApellidos(poliza.cliente_id, (err, cliente) => {
                            if (err) return reject(err);

                            // Asegúrate de que `cliente` no sea `undefined`
                            if (cliente) {
                                polizasConDetalles.push({
                                    ...poliza,
                                    nombre: cliente.nombre,
                                    apellidos: cliente.apellidos
                                });
                            }
                            resolve();
                        });
                    });
                });

                Promise.all(promises)
                    .then(() => {
                        console.log('Resultados obtenidos en PolizaService:', polizasConDetalles);
                        resolve(polizasConDetalles);
                    })
                    .catch(err => {
                        console.error('Error al obtener nombres y apellidos en PolizaService:', err);
                        reject(err);
                    });
            });
        });
    }

    static async getPoliciesBySearchPaginated(searchTerm = '', page = 1, limit = 5) {
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 5;
        const offset = (pageNumber - 1) * limitNumber;

        try {
            // Validación de que el número de página sea válido
            if (offset < 0) {
                throw new Error("El número de página no puede ser menor que 1");
            }

            // Total de pólizas para la paginación
            const totalPolicies = await Poliza.getTotalPoliciesBySearch(searchTerm);
            const totalPages = Math.ceil(totalPolicies / limitNumber);

            // Si la página solicitada está fuera del rango, retornar una respuesta vacía
            if (pageNumber > totalPages) {
                return {
                    policies: [],
                    totalPages,
                    totalItems: totalPolicies,
                    currentPage: pageNumber,
                    limit: limitNumber
                };
            }

            // Obtener pólizas paginadas
            const policies = await Poliza.searchPolicies(searchTerm, limitNumber, offset);

            return {
                policies,
                totalPages,
                totalItems: totalPolicies,
                currentPage: pageNumber,
                limit: limitNumber
            };
        } catch (error) {
            throw new Error("Error al obtener pólizas paginadas por búsqueda: " + error.message);
        }
    }

    static obtenerPolizaPorId(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM polizas WHERE id = ?';
            this.db.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null);
                resolve(results[0]);
            });
        });
    }
}

module.exports = PolizaService;










