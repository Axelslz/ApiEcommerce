const PagoModel = require('../models/pagoModel');
    
const generarPagos = async (poliza) => {
        const { prima_neta, vigencia_de, vigencia_hasta, periodicidad_pago } = poliza;
        let pagos = [];
        let fechaActual = new Date(vigencia_de);
        const fechaFinal = new Date(vigencia_hasta);
        let intervalo;
    
        if (periodicidad_pago === 'mensual') {
            intervalo = 30; // Cada 30 días
        } else if (periodicidad_pago === 'quincenal') {
            intervalo = 15; // Cada 15 días
        } else if (periodicidad_pago === 'anual') {
            intervalo = 365; // Cada año
        } else {
            throw new Error('Periodicidad de pago no válida');
        }
    
        if (periodicidad_pago === 'anual') {
            pagos.push({
                monto: prima_neta, 
                fecha_pago: new Date(fechaFinal), 
                poliza_id: poliza.id,
                status: 'pendiente'
            });
        } else {
            const totalPagos = periodicidad_pago === 'mensual' ? 12 : 24; 
            const montoPorPago = prima_neta / totalPagos; 
    
            while (fechaActual <= fechaFinal) {
                pagos.push({
                    monto: montoPorPago, 
                    fecha_pago: new Date(fechaActual),
                    poliza_id: poliza.id,
                    status: 'pendiente'
                });
                fechaActual.setDate(fechaActual.getDate() + intervalo);
            }
        }
    
        for (const pago of pagos) {
            await PagoModel.createPago(pago);
        }
};

const obtenerPagosPorPolizaPaginado = async (poliza_id, limit = 5, offset = 0) => {
    try {
        const pagos = await PagoModel.obtenerPagosPorPolizaPaginado(poliza_id, limit, offset);
        const totalPagos = await PagoModel.contarPagosPorPoliza(poliza_id);
        const totalPages = Math.ceil(totalPagos / limit);
        return { pagos, totalPages };
    } catch (error) {
        throw new Error('Error al obtener los pagos paginados');
    }
};

const obtenerTodosLosPagosPaginado = async (limit = 5, offset = 0) => {
    try {
        const pagos = await PagoModel.obtenerTodosLosPagosPaginado(limit, offset);
        const totalPagos = await PagoModel.contarPagosTotales();
        const totalPages = Math.ceil(totalPagos / limit);
        return { pagos, totalPages };
    } catch (error) {
        throw new Error('Error al obtener todos los pagos paginados');
    }
};

const obtenerPagosPorPolizaPorID = async (poliza_id, limit = 5, offset = 0) => {
    try {
        const pagos = await PagoModel.obtenerPagosPorPolizaPaginado(poliza_id, limit, offset);
        const totalPagos = await PagoModel.contarPagosPorPoliza(poliza_id);
        const totalPages = Math.ceil(totalPagos / limit);
        
        const pagosFormateados = pagos.map((pago, index) => ({
            numeroPago: index + 1 + offset,
            fecha_pago: pago.fecha_pago.toISOString().split('T')[0], // Formato YYYY-MM-DD
            estado_pago: pago.status,
            emision_pago: pago.created_at.toISOString().split('T')[0] // Fecha de creación como emisión
        }));

        return { pagos: pagosFormateados, totalPages };
    } catch (error) {
        throw new Error('Error al obtener los pagos paginados');
    }
};


module.exports = {
    generarPagos,
    obtenerPagosPorPolizaPaginado,
    obtenerTodosLosPagosPaginado,
    obtenerPagosPorPolizaPorID
};



