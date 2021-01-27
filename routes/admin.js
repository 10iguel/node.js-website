const path = require('path')
const express = require('express')
const adminController = require('../controllers/admin')
const {protect} = require('../middlewares/protect')
const router = express.Router()

// /admin/add-product => GET
router.get('/add-product',protect,adminController.getAddProduct)
//
//  // /admin/products => GET
router.get('/products',protect,adminController.getProducts)
//
// /admin/add-product => POST
router.post('/add-product',protect,adminController.postAddProduct)
//
 router.get('/edit-product/:productId',protect,adminController.getEditProduct)

 router.post('/edit-product',protect,adminController.postEditProduct)
//
 router.post('/delete-product',protect,adminController.postDeleteProduct)

module.exports = router
