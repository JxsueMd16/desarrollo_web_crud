// routes/viewRoutes.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/productController');

router.get('/products-view', c.renderProductsView);
router.get('/products/:id/images-view', c.renderImagesView);

module.exports = router;
