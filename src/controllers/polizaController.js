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
        res.status(201).json({ message: 'Póliza agregada', id: result.insertId });
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

exports.obtenerPolizas = async (req, res) => {
    try {
        const polizas = await PolizaService.obtenerPolizas();
        res.status(200).json(polizas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
