const clientService = require('../services/clientService');
const { calcularEdad } = require('../utils/calcularEdad');

exports.addClient = async (req, res) => {
  try {
      const data = req.body;
      console.log("Datos recibidos:", data); 
      data.edad = calcularEdad(data.fecha_nacimiento);
      const result = await clientService.addClient(data);
      res.status(201).json({ message: 'Cliente agregado exitosamente', id: result.insertId });
  } catch (error) {
      console.error("Error en el controlador:", error); 
      res.status(500).json({ error: error.message });
  }
};
exports.updateClient = async (req, res) => {
  try {
      const id = req.params.id;
      const data = req.body;
      data.edad = calcularEdad(data.fecha_nacimiento);
      await clientService.updateClient(id, data);
      res.status(200).json({ message: 'Cliente actualizado exitosamente' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
