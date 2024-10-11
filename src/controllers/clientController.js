const clientService = require('../services/clientService');
const { calcularEdad } = require('../utils/calcularEdad');

exports.addClient = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.params.usuario_id; 
        data.user_id = userId; 
        
        const result = await clientService.addClient(data);

        const newClient = {
            id: result.insertId,
            nombre: data.nombre,
            apellidos: data.apellidos,
            telefono: data.telefono,
            contacto_emergencia: data.contacto_emergencia,
            correo: data.correo,
            fecha_nacimiento: data.fecha_nacimiento,
            user_id: data.user_id,
        };
        
        res.status(201).json({ message: 'Cliente agregado exitosamente', client: newClient });
    } catch (error) {
        console.error("Error en el controlador:", error); 
        res.status(500).json({ error: error.message });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const userId = req.params.usuario_id;  
        const clientId = req.params.id;
        const data = req.body;
        const client = await clientService.getClientById(clientId);

        if (!client || client.user_id !== parseInt(userId)) {
            return res.status(404).json({ message: 'Cliente no encontrado para este usuario' });
        }
        await clientService.updateClient(clientId, data);

        const updatedClient = await clientService.getClientById(clientId);

        res.status(200).json({ 
            message: 'Cliente actualizado exitosamente', 
            client: {
                id: updatedClient.id,
                nombre: updatedClient.nombre,
                apellidos: updatedClient.apellidos,
                telefono: updatedClient.telefono,
                contacto_emergencia: updatedClient.contacto_emergencia,
                correo: updatedClient.correo,
                fecha_nacimiento: updatedClient.fecha_nacimiento,
                user_id: updatedClient.user_id
            } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.buscarClientes = async (req, res) => {
    try {
        const userId = req.params.usuario_id;
        const searchTerm = req.query.term || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const { clients, total, totalPages } = await clientService.searchClients(searchTerm, userId, page, limit);

        res.status(200).json({
            message: 'Clientes encontrados exitosamente',
            clients,
            total,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const userId = req.params.usuario_id;
        const clientId = req.params.id;
        const client = await clientService.getClientById(clientId);

        if (!client || client.user_id !== parseInt(userId)) {
            return res.status(404).json({ message: 'Cliente no encontrado para este usuario' });
        }

        client.edad = calcularEdad(client.fecha_nacimiento);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getClientsByUserId = async (req, res) => {
    try {
        const user_id = req.params.usuario_id; 
        const limit = parseInt(req.query.limit) || 5; 
        const page = parseInt(req.query.page) || 1; 
        const offset = (page - 1) * limit; 

        if (!user_id) {
            return res.status(400).json({ error: 'usuario_id no proporcionado' });
        }

        const { clients, totalPages } = await clientService.getClientsByUserId(user_id, limit, offset); // Pasamos limit y offset
        res.status(200).json({ clients, totalPages });
    } catch (error) {
        console.error('Error al obtener los clientes por usuario:', error);
        res.status(500).json({ error: 'Error al obtener los clientes por usuario' });
    }
};



exports.getClientsPaginated = async (req, res) => {
    try {
        const userId = req.user.id; 
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 5; 
        const result = await clientService.getClientsPaginated(userId, page, limit);

        res.status(200).json({
            clients: result.clients,
            totalPages: result.totalPages, 
            limit: limit
        });
    } catch (error) {
        console.error('Error en el controlador:', error);
        res.status(500).json({ error: error.message });
    }
};













  