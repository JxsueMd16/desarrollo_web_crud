// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('../routes/productRoutes');
const viewRoutes = require('../routes/viewRoutes');
const authRoutes = require('../routes/authRoutes');
const { errorHandler } = require('../middleware/errorMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// APIs
app.use('/api/auth', authRoutes); 
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes); 

// Vistas
app.use('/', viewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
