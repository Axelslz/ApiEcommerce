const PagoService = require('../services/pagoService');
const PolizaModel = require('../models/polizaModel');

const generarPagos = async (poliza) => {
    const { prima_neta, vigencia_de, vigencia_hasta, periodicidad_pago } = poliza;
    let pagos = [];
    let fechaActual = new Date(vigencia_de);
    const fechaFinal = new Date(vigencia_hasta);
    let intervalo;

    // Establecer el intervalo según la periodicidad
    if (periodicidad_pago === 'mensual') {
        intervalo = 30; // Mensual
    } else if (periodicidad_pago === 'semanal') {
        intervalo = 7; // Semanal
    } else if (periodicidad_pago === 'anual') {
        intervalo = 365; // Anual
    } else {
        throw new Error('Periodicidad de pago no válida');
    }

    while (fechaActual <= fechaFinal) {
        pagos.push({
            monto: calcularMonto(prima_neta, periodicidad_pago),
            fecha_pago: new Date(fechaActual),
            poliza_id: poliza.id,
            status: 'pendiente'
        });
        fechaActual.setDate(fechaActual.getDate() + intervalo);
    }

    for (const pago of pagos) {
        await PagoService.createPago(pago);
    }
};

const calcularMonto = (prima_neta, periodicidad_pago) => {
    if (periodicidad_pago === 'mensual') {
        return prima_neta / 12;
    } else if (periodicidad_pago === 'semanal') {
        return prima_neta / 52;
    } else if (periodicidad_pago === 'anual') {
        return prima_neta;
    }
    throw new Error('Periodicidad de pago no válida');
};

const agregarPagoAutomatico = async (req, res) => {
    try {
        const poliza = await PolizaModel.obtenerPolizaPorId(req.params.poliza_id);
        if (!poliza) {
            return res.status(404).json({ error: 'Póliza no encontrada' });
        }

        await generarPagos(poliza);
        res.status(200).json({ message: 'Pagos generados automáticamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar pagos' });
    }
};

const obtenerPagosPorPoliza = async (req, res) => {
    try {
        const { poliza_id } = req.params;
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { pagos, totalPages } = await PagoService.obtenerPagosPorPolizaPaginado(poliza_id, limit, offset);

        res.status(200).json({ pagos, totalPages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerPagosPorUsuarioPaginado = async (req, res) => {
    const userId = req.params.userId; 
    const page = parseInt(req.query.page) || 1; 

    try {
        const { pagos, totalPages } = await PagoService.obtenerPagosPorUsuarioPaginado(userId, page);
        res.json({ pagos, totalPages });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos', error });
    }
};

const obtenerPagosPorPolizaPorID = async (req, res) => {
    try {
        const { poliza_id } = req.params;
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { poliza, pagos, totalPages } = await PagoService.obtenerPolizaPorIDPaginado(poliza_id, limit, offset);
        console.log("Pagos obtenidos por póliza:", { pagos, totalPages }); // Para verificar la respuesta

        res.status(200).json({
            prima_neta: poliza ? poliza.prima_neta : null,
            periodicidad_pago: poliza ? poliza.periodicidad_pago : null,
            poliza_id,
            pagos, 
            totalPages
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    generarPagos,
    agregarPagoAutomatico,
    obtenerPagosPorPoliza,
    obtenerPagosPorUsuarioPaginado,
    obtenerPagosPorPolizaPorID
};

