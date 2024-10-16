module.exports = (req, res, next) => {
    console.log("Datos recibidos en el middleware:", req.body);

    const { nombre, apellidos, telefono, correo, fecha_nacimiento } = req.body;

    if (!nombre || !apellidos || !telefono || !correo || !fecha_nacimiento) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'El correo electrónico no es válido' });
    }
    
    next();
};

  
