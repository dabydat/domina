import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[Auth] Token verificado: ${JSON.stringify(decoded)}`);
    req.user = decoded;  // opcional si quieres pasar el usuario al backend
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};
