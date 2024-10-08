const PolizaService = require('../services/polizaService');

exports.agregarPoliza = async (req, res) => {
    try {
        const { cliente_id } = req.params; 
        const nuevaPoliza = {
            tipo_seguro: req.body.tipo_seguro,
            prima_neta: req.body.prima_neta,
            asegurado: req.body.asegurado,
            vigencia_de: req.body.vigencia_de,
            vigencia_hasta: req.body.vigencia_hasta,
            periodicidad_pago: req.body.periodicidad_pago,
            archivo_pdf: req.body.archivo_pdf,
            cliente_id: cliente_id 
        };

        const result = await PolizaService.agregarPoliza(nuevaPoliza);
        
        res.status(201).json({
            message: 'Póliza agregada',
            id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editarPoliza = async (req, res) => {
    try {
        const { id, cliente_id } = req.params; 
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

exports.obtenerPolizasPorCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params; 
        const limit = parseInt(req.query.limit) || 5;  
        const page = parseInt(req.query.page) || 1;  
        const offset = (page - 1) * limit;

        const polizas = await PolizaService.obtenerPolizasPorCliente(cliente_id, limit, offset);
        const total = await PolizaService.getTotalPoliciesByCliente(cliente_id);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({ polizas, totalPages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerTodasPolizas = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;  
        const page = parseInt(req.query.page) || 1;  
        const offset = (page - 1) * limit;

        const { polizas, totalPages } = await PolizaService.obtenerTodasPolizas(limit, offset);
        res.status(200).json({ polizas, totalPages }); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.buscarPolizas = async (req, res) => {
    try {
        const searchTerm = req.query.search || ''; 
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { polizas, totalPages } = await PolizaService.buscarPolizas(searchTerm, limit, offset);
        res.status(200).json({ polizas, totalPages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
