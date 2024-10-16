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
    }

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


module.exports = {
    generarPagos,
    obtenerPagosPorPolizaPaginado
};



