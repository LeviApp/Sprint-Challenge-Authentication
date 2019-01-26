const jwt = require('jsonwebtoken');


const jwtKey =
  process.env.JWT_SECRET ||
  'add a .env file to root of project with the JWT_SECRET variable';

// quickly see what this file exports
module.exports = {
  authenticate,
};

// implementation details
function authenticate(req, res, next) {
  const token = req.get('Authorization');

  if (token) {
    jwt.verify(token, jwtKey, (err, decodedToken) => {
      if (err) {
        res.status(401).json({
          message: `Invalid Token`
        })
      } else {
        req.username = decodedToken.username;
        next();
      }
    })
  } else {
    res.status(401).json({
      message: `No Token`
    })
  }
}