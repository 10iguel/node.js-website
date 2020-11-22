const path = require('path')

const express = require('express')

const rootDir = require('../utils/path')
const adminData = require('./admin')
const {getIndex,getProducts,getProduct,getCart,getCheckout,getOrders} = require('../controllers/shop')

const router = express.Router()

router.get('/',getIndex)

router.get('/products',getProducts)

router.get('/products/productId',getProduct)

router.get('/cart',getCart)

router.get('/orders',getOrders)

router.get('/checkout',getCheckout)


module.exports = router
