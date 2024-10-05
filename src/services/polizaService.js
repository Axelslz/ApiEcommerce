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
            Poliza.searchPolicies(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = PolizaService;

