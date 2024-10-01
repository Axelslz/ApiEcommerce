const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const generatePasswordResetToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, { expiresIn: '90s' });
};

const verifyPasswordResetToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const sendPasswordResetEmail = async (email, token) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `https://yourfrontend.com/reset-password/${token}`;
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Restablecer contraseña',
    text: `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}. El enlace expirará en 1.5 minutos.`,
  };

  await transporter.sendMail(mailOptions);
};

const UserController = {
  register: (req, res) => {
    const userData = req.body;
    UserService.createUser(userData)
      .then(() => {
        res.status(201).json({ message: `Bienvenido, ${userData.name}! Registro Exitoso.` });
      })
      .catch((error) => {
        res.status(500).json({ message: error });
      });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await UserService.login(email, password)
      res.status(200).json({
        message: 'Login exitoso',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  },

  requestPasswordReset: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const token = generatePasswordResetToken(user.id);
      await sendPasswordResetEmail(user.email, token);

      res.json({ message: 'Se ha enviado un enlace para restablecer la contraseña' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result = await UserService.resetPassword(decoded.id, hashedPassword);
      res.json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
      res.status(400).json({ message: 'Token inválido o expirado' });
    }
  },
};

module.exports = UserController;



