const ClientService = require('../services/clientService');

const ClientController = {
    createClient: (req, res) => {
        const clientData = req.body;
        ClientService.createClient(clientData)
          .then((result) => {
            res.status(201).json({
              message: 'Cliente creado exitosamente',
              id: result.insertId,  
              name: clientData.name,
              phone: clientData.phone,
              email: clientData.email
            });
          })
          .catch((error) => {
            res.status(500).json({ message: error.message });
          });
      },

    getClientById: async (req, res) => {
        try {
          const client = await ClientService.getClientById(req.params.id);
          res.json(client);
        } catch (error) {
          res.status(404).json({ message: 'Cliente no encontrado' });
        }
      },
    
      update: async (req, res) => {
        try {
          const clientData = req.body;
          const result = await ClientService.updateClient(req.params.id, clientData);
          res.json({ message: 'Cliente actualizado exitosamente' });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
    
      delete: async (req, res) => {
        try {
          await ClientService.deleteClient(req.params.id);
          res.json({ message: 'Cliente eliminado exitosamente' });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    };

module.exports = ClientController;
