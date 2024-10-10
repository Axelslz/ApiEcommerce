const clientService = require('../services/clientService');
const { calcularEdad } = require('../utils/calcularEdad');

exports.addClient = async (req, res) => {
  try {
      const data = req.body;
      const userId = req.user.id; 
      data.edad = calcularEdad(data.fecha_nacimiento);
      data.user_id = userId;
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

exports.getClients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const { results, totalPages } = await clientService.getClientsPaginated(page);
        res.status(200).json({ clients: results, totalPages }); // Cambié el formato de respuesta
    } catch (error) {
        console.error("Error en el controlador:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.searchClients = async (req, res) => {
    try {
        const searchTerm = req.query.term; 
        const page = parseInt(req.query.page) || 1;

        const result = await clientService.searchClients(searchTerm, page);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error en el controlador:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const id = req.params.id;  
        const client = await clientService.getClientById(id);  
  
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        client.edad = calcularEdad(client.fecha_nacimiento);
  
        res.status(200).json(client); 
    } catch (error) {
        console.error("Error en el controlador:", error);
        res.status(500).json({ error: error.message });
    }
  };
  