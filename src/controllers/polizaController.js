const polizaService = require('../services/polizaService');
const PagoService = require('../services/pagoService');
const { cloudinary } = require('../config/cloudinary');
const createXlsx = require('../utils/createXlsx');

exports.agregarPoliza = async (req, res) => {
    try {
        const { cliente_id } = req.params;
        let archivo_pdf_url = null; 
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'raw',  
                folder: 'PolizaPDF-Agentlite',  
            });
            archivo_pdf_url = result.secure_url; 
        }

        const nuevaPoliza = {
            tipo_seguro: req.body.tipo_seguro,
            prima_neta: req.body.prima_neta,
            asegurado: req.body.asegurado,
            vigencia_de: req.body.vigencia_de,
            vigencia_hasta: req.body.vigencia_hasta,
            periodicidad_pago: req.body.periodicidad_pago,
            archivo_pdf: archivo_pdf_url || null,  
            cliente_id: cliente_id,
        };

        const result = await polizaService.agregarPoliza(nuevaPoliza);
        const polizaCreada = { ...nuevaPoliza, id: result.insertId };

        await PagoService.generarPagos(polizaCreada);

        res.status(201).json({
            message: 'Póliza agregada correctamente',
            id: result.insertId,
            archivo_pdf_url: archivo_pdf_url,  
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editarPoliza = async (req, res) => {
    try {
        const { id, cliente_id } = req.params;
        const datosActualizados = req.body;

        await polizaService.editarPoliza(id, cliente_id, datosActualizados);
        res.status(200).json({ message: 'Póliza actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarPoliza = async (req, res) => {
    try {
        const { id, cliente_id } = req.params;

        const poliza = await polizaService.obtenerPolizaPorId(id);
        if (poliza.cliente_id !== parseInt(cliente_id)) {
            return res.status(403).json({ message: 'No autorizado para eliminar esta póliza.' });
        }

        await polizaService.eliminarPoliza(id);
        res.status(200).json({ message: 'Póliza eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerPolizaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const poliza = await polizaService.obtenerPolizaPorId(id);

        if (!poliza) {
            return res.status(404).json({ message: 'Póliza no encontrada' });
        }

        res.status(200).json(poliza);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerPolizasPorCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params;
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const polizas = await polizaService.obtenerPolizasPorCliente(cliente_id, limit, offset);
        const total = await polizaService.getTotalPoliciesByCliente(cliente_id);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({ polizas, totalPages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerPolizasPorUsuario = async (req, res) => {
    try {
        const { user_id } = req.params;
        const page = parseInt(req.query.page) || 1;  

        const result = await polizaService.obtenerPolizasPorUsuario(user_id, page);
        if (result.polizas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pólizas para este usuario' });
        }
        
        res.status(200).json({
            polizas: result.polizas,
            totalPolizas: result.totalPolizas,
            totalPages: result.totalPages,
            currentPage: result.currentPage
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.buscarPolizasPorUsuario = async (req, res) => {
    try {
        const { user_id } = req.params;
        const searchTerm = req.query.search || '';  
        const page = parseInt(req.query.page) || 1;  

        const polizas = await polizaService.buscarPolizasPorUsuario(user_id, searchTerm, page);
        
        if (polizas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pólizas que coincidan con los criterios de búsqueda' });
        }
        
        res.status(200).json(polizas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTotalPoliciesByCliente = async (req, res) => {
    try {
        const { cliente_id } = req.params;
        const total = await polizaService.getTotalPoliciesByCliente(cliente_id);
        res.status(200).json({ total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.downloadAllPolicies = async (req, res) => {
    try {
        const userId = req.params.usuario_id;
        const policies = await polizaService.obtenerPolizasPorUsuario(userId);

        const filePath = await createXlsx(policies, 'Polizas');
        res.download(filePath, 'todas_polizas.xlsx');
    } catch (error) {
        console.error('Error al descargar todas las pólizas:', error);
        res.status(500).json({ error: 'Error al descargar todas las pólizas' });
    }
};

exports.obtenerPolizasConDetalles = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const polizasConDetalles = await polizaService.obtenerPolizasConDetalles(limit, offset);

        console.log('Poliza Detalles en el controlador:', polizasConDetalles);
        res.status(200).json(polizasConDetalles);
    } catch (err) {
        console.error('Error en el controlador:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerTodasPolizas = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { polizas, totalPages } = await polizaService.obtenerTodasPolizas(limit, offset);

        if (polizas.length === 0) {
            return res.status(404).json({ message: 'No hay pólizas disponibles' });
        }

        res.status(200).json({ polizas, totalPages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};









