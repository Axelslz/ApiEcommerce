const Poliza = require('../models/polizaModel');
const ClientModel = require('../models/clientModel');
const db = require('../config/database');

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
    
                console.log(`Comparando cliente_id: poliza(${polizaClienteIdParsed}) vs entrada(${inputClienteId})`); 
    
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

    static obtenerPolizasPorCliente(cliente_id, limit, offset) {
        return new Promise((resolve, reject) => {
            limit = typeof limit === 'number' ? limit : undefined;
            offset = typeof offset === 'number' ? offset : undefined;
    
            Poliza.obtenerPolizasPorCliente(cliente_id, limit, offset, (err, results) => {
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

            if (offset < 0) {
                throw new Error("El número de página no puede ser menor que 1");
            }

            const totalPolicies = await Poliza.getTotalPoliciesBySearch(searchTerm);
            const totalPages = Math.ceil(totalPolicies / limitNumber);

            if (pageNumber > totalPages) {
                return {
                    policies: [],
                    totalPages,
                    totalItems: totalPolicies,
                    currentPage: pageNumber,
                    limit: limitNumber
                };
            }

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

    static async obtenerPolizasPorUsuario(user_id, page = 1, limit = 5) {
        const offset = (page - 1) * limit;

        return new Promise((resolve, reject) => {
            Poliza.obtenerPolizasPorUsuario(user_id, limit, offset, (err, result) => {
                if (err) {
                    return reject(new Error('Error obteniendo las pólizas: ' + err.message));
                }
                
                const totalPolizas = result.totalPolizas;
                const totalPages = Math.ceil(totalPolizas / limit);
                resolve({
                    polizas: result.polizas,
                    totalPolizas,
                    totalPages,
                    currentPage: page
                });
            });
        });
    }

    static async buscarPolizasPorUsuario(user_id, searchTerm, page = 1, limit = 5) {
        const offset = (page - 1) * limit;

        return new Promise((resolve, reject) => {
            Poliza.buscarPolizasPorUsuario(user_id, searchTerm, limit, offset, (err, result) => {
                if (err) {
                    return reject(new Error('Error buscando las pólizas: ' + err.message));
                }
                
                resolve(result);
            });
        });
    }

}

module.exports = PolizaService;










