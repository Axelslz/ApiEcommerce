const Poliza = require('../models/polizaModel');
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
    
    static searchPolicies(query) {
        return new Promise((resolve, reject) => {
            const searchQuery = `
                SELECT * FROM polizas
                WHERE tipo_seguro LIKE ?
                OR prima_neta LIKE ?
                OR asegurado LIKE ?
                OR vigencia_de LIKE ?
                OR vigencia_hasta LIKE ?
                OR periodicidad_pago LIKE ?
                OR archivo_pdf LIKE ?
            `;
            const likeQuery = `%${query}%`;
            db.query(searchQuery, [
                likeQuery, likeQuery, likeQuery, likeQuery, likeQuery, likeQuery, likeQuery
            ], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    
}

module.exports = PolizaService;
