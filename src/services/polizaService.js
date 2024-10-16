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
            Poliza.getAllPolicies(limit, offset, (err, results) => {
                if (err) return reject(err);

                Poliza.getTotalPolicies((err, total) => {
                    if (err) return reject(err);
                    const totalPages = Math.ceil(total / limit);
                    resolve({ polizas: results, totalPages });
                });
            });
        });
    }
    static obtenerPolizasPorCliente(cliente_id, limit, offset) {
        return new Promise((resolve, reject) => {
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
    
}

module.exports = PolizaService;










