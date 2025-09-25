// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/products/count', c.countProducts);
router.get('/products/sum', c.sumProducts);

// CRUD
router.post('/products', protect, c.createProduct); 
router.get('/products', c.getProducts); 
router.post('/products/:id/images', protect, c.createImage); 
router.get('/products/:id/images', c.getImagesByProduct);

router.get('/products/:id', c.getProductById);
router.put('/products/:id', protect, c.updateProduct);
router.delete('/products/:id', protect, c.deleteProduct);

module.exports = router;
