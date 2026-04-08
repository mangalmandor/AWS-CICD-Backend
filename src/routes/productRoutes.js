const express = require('express');
const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getFilteredProducts
} = require('../controllers/productController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(requireAuth, requireRole('seller', 'admin'), createProduct);

router.get('/search', getFilteredProducts);

router.route('/:id')
    .get(requireAuth, getProductById)
    .put(requireAuth, requireRole('seller', 'admin'), updateProduct)
    .delete(requireAuth, requireRole('seller', 'admin'), deleteProduct);

module.exports = router;