const express = require('express');
const router = express.Router();
const c = require('../controllers/productController');

// CRUD
router.post('/products', c.createProduct);
router.get('/products', c.getProducts);
router.get('/products/:id', c.getProductById);
router.put('/products/:id', c.updateProduct);
router.delete('/products/:id', c.deleteProduct);

router.get('/products/count', c.countProducts);
router.get('/products/sum', c.sumProducts);
router.post('/products/:id/images', c.createImage);
router.get('/products/:id/images', c.getImagesByProduct);

module.exports = router;
