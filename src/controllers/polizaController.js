const PolizaService = require('../services/polizaService');

exports.agregarPoliza = async (req, res) => {
    try {
        const nuevaPoliza = {
            tipo_seguro: req.body.tipo_seguro,
            prima_neta: req.body.prima_neta,
            asegurado: req.body.asegurado,
            vigencia_de: req.body.vigencia_de,
            vigencia_hasta: req.body.vigencia_hasta,
            periodicidad_pago: req.body.periodicidad_pago,
            archivo_pdf: req.body.archivo_pdf
        };

        const result = await PolizaService.agregarPoliza(nuevaPoliza);
        
        res.status(201).json({
            message: 'Póliza agregada',
            id: result.insertId // Asegúrate de que esto se reciba correctamente
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editarPoliza = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;
        await PolizaService.editarPoliza(id, datosActualizados);
        res.status(200).json({ message: 'Póliza actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarPoliza = async (req, res) => {
    try {
        const { id } = req.params;
        await PolizaService.eliminarPoliza(id);
        res.status(200).json({ message: 'Póliza eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerPolizaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const poliza = await PolizaService.obtenerPolizaPorId(id);
        if (!poliza) {
            return res.status(404).json({ message: 'Póliza no encontrada' });
        }
        res.status(200).json(poliza);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerTodasPolizas = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;  // Limitar a 5 por defecto
        const page = parseInt(req.query.page) || 1;  // Página 1 por defecto
        const offset = (page - 1) * limit;

        const polizas = await PolizaService.obtenerTodasPolizas(limit, offset);
        res.status(200).json(polizas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

