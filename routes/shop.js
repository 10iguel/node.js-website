const path = require('path')

const express = require('express')

const shopController = require('../controllers/shop')

const protect = require('../middlewares/protect')

const router = express.Router()

router.get('/',shopController.getIndex)

router.get('/products', shopController.getProducts)
//
router.get('/products/:productId', shopController.getProduct)
//
router.get('/cart', protect, shopController.getCart)

router.post('/cart', protect, shopController.postCart)
//
router.post('/cart-delete-item', protect, shopController.postCartDeleteProduct)

router.get('/checkout', protect, shopController.getCheckout)
//

router.get('/orders', protect, shopController.getOrders)

router.get('/orders/:orderId', protect, shopController.getInvoice)

module.exports = router
