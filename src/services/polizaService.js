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

    static obtenerPolizaPorId(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, asegurado, tipo_seguro FROM polizas WHERE id = ?'; // Solo devolver id, asegurado y tipo_seguro
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) {
                    resolve(results[0]); 
                } else {
                    resolve(null); 
                }
            });
        });
    }
    
}

module.exports = PolizaService;
