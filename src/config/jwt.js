const jwt = require('jsonwebtoken');

const generatePasswordResetToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    Math.random().toString(36).substring(7),  
    { expiresIn: '15m' }  
  );
  return token;
};

const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, Math.random().toString(36).substring(7));
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generatePasswordResetToken, verifyPasswordResetToken };
