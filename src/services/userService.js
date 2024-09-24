const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const UserService = {
  createUser: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    return new Promise((resolve, reject) => {
      UserModel.create(userData, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      UserModel.findByEmail(email, async (err, user) => {
        if (err || !user) {
          reject('User not found');
        } else {
          const userPassword = user.password;
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            reject('Incorrect password');
          } else {
            // Generar un token basado en el ID del usuario
            const token = jwt.sign({ id: user.id }, password); // Usa la contraseña como clave
            resolve({ user, token });
          }
        }
      });
    });
  },

  requestPasswordReset: async (email) => {
    return new Promise((resolve, reject) => {
        UserModel.findByEmail(email, async (err, user) => {
            if (err || !user) {
                return reject('User not found');
            }
            // Genera el token para el restablecimiento de contraseña
            const token = jwt.sign({ id: user.id }, user.password, { expiresIn: '15m' });

            // Aquí puedes configurar tu transporte de correo
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // Cambia esto según tu servicio de correo
                auth: {
                    user: 'axlsalazarr1602@gmail.com', // Cambia esto por tu correo
                    pass: 'tu_contraseña' // Cambia esto por tu contraseña
                }
            });

            const mailOptions = {
                from: 'tu_correo@gmail.com',
                to: email,
                subject: 'Recuperación de contraseña',
                text: `Aquí está tu token de recuperación: ${token}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return reject('Error al enviar el correo');
                }
                resolve({ message: 'Se ha enviado un correo para la recuperación de la contraseña' });
            });
        });
    });
},

  resetPassword: async (token, newPassword) => {
    try {
      const decoded = jwt.verify(token, newPassword); // Verifica el token usando la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      return new Promise((resolve, reject) => {
        UserModel.update(decoded.id, { password: hashedPassword }, (err, results) => {
          if (err) {
            reject('Error updating password');
          } else {
            resolve('Password updated successfully');
          }
        });
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },

  updateUser: (id, userData) => {
    return new Promise((resolve, reject) => {
      UserModel.update(id, userData, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
};

module.exports = UserService;


