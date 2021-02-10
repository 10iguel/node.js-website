const path = require('path')
const express = require('express')
const { body } = require('express-validator/check')
const adminController = require('../controllers/admin')
const protect = require('../middlewares/protect')
const router = express.Router()

// /admin/add-product => GET
router.get('/add-product',protect,adminController.getAddProduct)
//
//  // /admin/products => GET
router.get('/products',protect,adminController.getProducts)
//
// /admin/add-product => POST
router.post('/add-product',[
    body('title').isString().isLength({min:3}).trim(),
    body('price').isFloat(),
    body('description').isLength({min:5, max:400}).trim()],
    protect,adminController.postAddProduct)
//
 router.get('/edit-product/:productId',protect,adminController.getEditProduct)

 router.post('/edit-product',[
     body('title').isString().isLength({min:3}).trim(),
     body('price').isFloat(),
     body('description').isLength({min: 5, max: 400}).trim()],
     protect,adminController.postEditProduct)
//
 router.delete('/product/:productId',protect,adminController.deleteProduct)

module.exports = router
