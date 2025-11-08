const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
  // 1. Get token from the request header
  const token = req.header('x-auth-token'); 

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If token exists, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Add the user's info to the request object
    req.user = decoded.user;
    next(); // Move on to the next function (the actual route)
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};