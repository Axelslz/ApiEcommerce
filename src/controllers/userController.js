const UserService = require('../services/userService');

const UserController = {
  register: (req, res) => {
    const userData = req.body;
    UserService.createUser(userData)
      .then((result) => {
        res.status(201).json({ message: 'Bienvenido, ' + userData.name + '! Registro Exitoso.' });
      })
      .catch((error) => {
        res.status(500).json({ message: error });
      });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await UserService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const updatedUser = await UserService.updateUser(req.user.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  requestPasswordReset: async (req, res) => {
    try {
      const result = await UserService.requestPasswordReset(req.body.email);
      const token = generatePasswordResetToken(result.user);  
      res.json({ message: 'Password reset token generated', token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      const decoded = verifyPasswordResetToken(token);
      const result = await UserService.resetPassword(decoded.id, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = UserController;
