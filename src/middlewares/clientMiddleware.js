module.exports = (req, res, next) => {
    console.log("Datos recibidos en el middleware:", req.body);

    const { nombre, apellidos, telefono, correo, fecha_nacimiento } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !apellidos || !telefono || !correo || !fecha_nacimiento) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación del formato del correo electrónico
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El correo electrónico no es válido' });
    }

    // Si todo está correcto, pasa al siguiente middleware o controlador
    next();
};

  
