// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../db');

const protect = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ error: 'No autorizado: token ausente' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const r = await db.query('SELECT id, email FROM users WHERE id = ?', [decoded.id]);
    if (!r.rows.length) {
      return res.status(401).json({ error: 'No autorizado: usuario no existe' });
    }

    req.user = r.rows[0]; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'No autorizado: token inválido o expirado' });
  }
};

module.exports = { protect };
