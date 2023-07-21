const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const authenticateToken = require('../middleware/authMiddleware')

// Get all products
router.get('/', authenticateToken, productController.getAllProducts)
// Get product by id
router.get('/:productId', authenticateToken, productController.getProductById)
// Create product
router.post('/', authenticateToken, productController.createProduct)
// Update product
router.put('/:productId', authenticateToken, productController.updateProduct)
// Delete product
router.delete('/:productId', authenticateToken, productController.deleteProduct)

module.exports = router