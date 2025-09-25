// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { randomUUID } = require('crypto'); // para generar UUID v4

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son requeridos' });
    }

    // verificar existencia
    const exists = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.rows.length) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const userId = randomUUID(); // UUID generado en Node

    await db.pool.execute(
      'INSERT INTO users (id, email, password) VALUES (?, ?, ?)',
      [userId, email, hashed]
    );

    res.status(201).json({
      id: userId,
      email,
      token: signToken(userId)
    });
  } catch (err) {
    console.error('[register]', err);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son requeridos' });
    }

    const r = await db.query('SELECT id, email, password FROM users WHERE email = ?', [email]);
    if (!r.rows.length) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json({
      id: user.id,
      email: user.email,
      token: signToken(user.id)
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ error: 'Error iniciando sesión' });
  }
};

exports.me = async (req, res) => {

  res.json({ id: req.user.id, email: req.user.email });
};