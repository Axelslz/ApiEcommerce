const jwt = require('jsonwebtoken');

const generatePasswordResetToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,  
    { expiresIn: '1h' }  
  );
  return token;
};

const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generatePasswordResetToken, verifyPasswordResetToken };

