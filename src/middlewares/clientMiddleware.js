module.exports = (req, res, next) => {
    console.log("Datos recibidos en el middleware:", req.body); // Agregado para depuración

    const { nombre, apellidos, telefono, correo, fecha_nacimiento, edad } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !apellidos || !telefono || !correo || !fecha_nacimiento || !edad) {
        console.log("Campos faltantes:", { nombre, apellidos, telefono, correo, fecha_nacimiento, edad }); // Agregado para depuración
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación de edad
    if (typeof edad !== 'number') {
        return res.status(400).json({ error: 'La edad debe ser un número válido' });
    }

    // Validación del formato del correo electrónico
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El correo electrónico no es válido' });
    }

    next();
};
