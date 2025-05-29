// middelware
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  const authHeader = req.headers.authorization;
  

  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET not configured' });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: 'Access denied: Token missing or malformed' });
  }

  const token = authHeader.split(" ")[1];
  

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
