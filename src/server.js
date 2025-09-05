const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const productRoutes = require('../routes/productRoutes'); // APIs JSON
const viewRoutes = require('../routes/viewRoutes');       // Vistas EJS

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Archivos estáticos 
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api', productRoutes);

// Rutas de vistas
app.use('/', viewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
