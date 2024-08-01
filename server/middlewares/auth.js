const jwt = require('jsonwebtoken');
const InvalidToken = require('../models/InvalidToken');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided' });

  const invalidToken = await InvalidToken.findOne({ token });
  if (invalidToken) return res.status(401).json({ message: 'Access denied. Token is invalid' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Access denied. Token is invalid' });
  }
};

module.exports = auth;
