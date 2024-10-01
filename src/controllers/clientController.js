const ClientService = require('../services/clientService');

exports.addClient = async (req, res) => {
    try {
      const data = req.body;
      console.log("Datos recibidos:", data); 
      const result = await ClientService.addClient(data);
      console.log("Resultado del insert:", result); 

      res.status(201).json({
        message: 'Cliente agregado exitosamente'
      });
    } catch (error) {
      console.error("Error en el controlador:", error); 
      res.status(500).json({ error: error.message });
    };
};

exports.updateClient = async (req, res) => {
    try {
      const id = req.params.id; 
      const data = req.body; 
      await ClientService.updateClient(id, data);
  
      res.status(200).json({
        message: 'Cliente actualizado exitosamente'
      });
    } catch (error) {
      console.error("Error en el controlador:", error); 
      res.status(500).json({ error: error.message });
    }
  };
