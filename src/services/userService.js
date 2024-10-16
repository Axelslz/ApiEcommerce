const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const db = require('../config/database'); 

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
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            reject('Incorrect password');
          } else {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            delete user.password;
            delete user.profile_picture;
            resolve({ user, token });
          }
        }
      });
    });
  },

  getUserById: async (userId) => {
    return new Promise((resolve, reject) => {
      UserModel.findById(userId, (err, user) => {
        if (err || !user) {
          reject('User not found');
        } else {
          resolve(user);
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
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Recuperación de contraseña',
          text: `Aquí está tu token de recuperación: ${token}`,
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            return reject('Error al enviar el correo');
          }
          resolve({ message: 'Correo de recuperación enviado' });
        });
      });
    });
  },

  resetPassword: async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return new Promise((resolve, reject) => {
      UserModel.update(userId, { password: hashedPassword }, (err) => {
        if (err) {
          reject('Error al actualizar la contraseña');
        } else {
          resolve('Contraseña actualizada correctamente');
        }
      });
    });
  },

  updateUser: async (userId, updatedData) => {
    return new Promise((resolve, reject) => {
      UserModel.findById(userId, (err, currentUser) => {
        if (err) {
          return reject('Error al recuperar el usuario actual: ' + err);
        }

        const profile_picture = updatedData.profile_picture || currentUser.profile_picture;
  
        const sqlUpdate = 'UPDATE users SET name = ?, last_name = ?, email = ?, profile_picture = ? WHERE id = ?';
        const paramsUpdate = [updatedData.name, updatedData.last_name, updatedData.email, profile_picture, userId];
  
        db.query(sqlUpdate, paramsUpdate, (err, results) => {
          if (err) {
            return reject('Error al actualizar el usuario: ' + err);
          }

          UserModel.findById(userId, (err, updatedUser) => {
            if (err) {
              return reject('Error al recuperar el usuario actualizado: ' + err);
            }
  
            resolve(updatedUser); 
          });
        });
      });
    });
  },
  

};

module.exports = UserService;




