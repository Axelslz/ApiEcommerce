const jwt = require('jsonwebtoken');

const generatePasswordResetToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,  // Usa una clave secreta constante de tu archivo .env
    { expiresIn: '1h' }  // Duración de 1 hora
  );
  return token;
};

const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Usa la misma clave secreta
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generatePasswordResetToken, verifyPasswordResetToken };

