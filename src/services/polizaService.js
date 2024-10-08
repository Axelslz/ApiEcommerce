const Poliza = require('../models/polizaModel');

class PolizaService {
    static agregarPoliza(data) {
        return new Promise((resolve, reject) => {
            Poliza.agregarPoliza(data, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static editarPoliza(id, data) {
        return new Promise((resolve, reject) => {
            Poliza.editarPoliza(id, data, (err) => {
                if (err) return reject(err);
                resolve();
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

    static searchPolicies(query) {
        return new Promise((resolve, reject) => {
            Poliza.searchPolicies(query, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static obtenerTodasPolizas(limit, offset) {
        return new Promise((resolve, reject) => {
            Poliza.getAllPolicies(limit, offset, (err, results) => {
                if (err) return reject(err);
                
                // Obtener el total de pólizas
                Poliza.getTotalPolicies((err, total) => {
                    if (err) return reject(err);
                    
                    // Calcular el total de páginas
                    const totalPages = Math.ceil(total / limit);
                    resolve({ polizas: results, totalPages }); // Cambia el nombre de la propiedad a "polizas"
                });
            });
        });
    }

    static obtenerPolizasPorCliente(cliente_id, limit, offset) {
        return new Promise((resolve, reject) => {
            Poliza.obtenerPolizasPorCliente(cliente_id, limit, offset, (err, result) => {
                if (err) return reject(err);
                resolve(result);
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

    static getTotalPolicies() {
        return new Promise((resolve, reject) => {
            Poliza.getTotalPolicies((err, total) => {
                if (err) return reject(err);
                resolve(total);
            });
        });
    }

    static async getPoliciesPaginated(limit, offset) {
        return new Promise((resolve, reject) => {
            Poliza.getPoliciesPaginated(limit, offset, (err, results) => {
                if (err) return reject(err);
                
                // Obtener el total de pólizas
                Poliza.getTotalPolicies((err, total) => {
                    if (err) return reject(err);
                    
                    // Calcular el total de páginas
                    const totalPages = Math.ceil(total / limit);
                    resolve({ polizas: results, totalPages });
                });
            });
        });
    }

    static async buscarPolizas(searchTerm, limit, offset) {
        return new Promise((resolve, reject) => {
            Poliza.searchPolicies(searchTerm, limit, offset, (err, results) => {
                if (err) return reject(err);

                // Obtener el total de pólizas que cumplen con el término de búsqueda
                Poliza.getTotalFilteredPolicies({ searchTerm }, (err, total) => {
                    if (err) return reject(err);

                    // Calcular el total de páginas
                    const totalPages = Math.ceil(total / limit);
                    resolve({ polizas: results, totalPages });
                });
            });
        });
    }

}

module.exports = PolizaService;


