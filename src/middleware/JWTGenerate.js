import jwt, { decode } from 'jsonwebtoken';
import { expiresIn, secret_key, secret_refresh_key } from '../config/jwt.config';

const generateJwt = (payload) => {
  let token = null;
  try {
    token = jwt.sign(payload, secret_key, { expiresIn: expiresIn });
  } catch (error) {
    console.log(error);
    return token;
  }
  return token;
};

const generateRefreshJwt = (payload) => {
  let refreshToken = null;
  try {
    refreshToken = jwt.sign(payload, secret_refresh_key, { expiresIn: '15d' });
  } catch (error) {
    console.log(error);
    return refreshToken;
  }
  return refreshToken;
};

// Middleware
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.token.split(' ')[1];
    jwt.verify(token, secret_key, function (error, user) {
      if (error) {
        return res.status(404).json({
          message: 'Unable to authenticate',
        });
      }
      const payload = user;
      // console.log(payload);
      if (payload.group === 'admin') {
        console.log('admin');
        next();
      } else if (payload.group === 'student') {
        // console.log('student');
        next();
      }
    });
  } catch (error) {
    throw error;
  }
};

export { generateJwt, verifyToken, generateRefreshJwt };
