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

    static buscarPolizas(searchTerm, page, limit) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit; 
            Poliza.searchPolicies(searchTerm, limit, offset, (err, results) => {
                if (err) return reject(err);

                Poliza.getTotalFilteredPolicies(searchTerm, (err, total) => {
                    if (err) return reject(err);
                    const totalPages = Math.ceil(total / limit);
                    resolve({ policies: results, totalItems: total });
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
            Poliza.obtenerPolizasPorCliente(cliente_id, limit, offset, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static getTotalPoliciesByCliente(cliente_id) {
        return new Promise((resolve, reject) => {
            Poliza.getTotalPoliciesByCliente(cliente_id, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static buscarPolizas(searchTerm, page, limit) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit; 
            Poliza.searchPolicies(searchTerm, limit, offset, (err, results) => {
                if (err) return reject(err);

                Poliza.getTotalFilteredPolicies(searchTerm, (err, total) => {
                    if (err) return reject(err);
                    const totalPages = Math.ceil(total / limit);
                    resolve({ policies: results, totalItems: total, totalPages });
                });
            });
        });
    }

    static buscarPolizasMasivas(searchTerm, page, limit) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * limit;
            Poliza.searchPoliciesMassive(searchTerm, limit, offset, (err, results) => {
                if (err) return reject(err);

                Poliza.getTotalFilteredPolicies(searchTerm, (err, total) => {
                    if (err) return reject(err);
                    resolve({ policies: results, totalItems: total });
                });
            });
        });
    }

}

module.exports = PolizaService;



