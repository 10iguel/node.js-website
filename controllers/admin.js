const fileHelper = require('../utils/file')

const {validationResult} = require('express-validator/check')

const Product = require('../models/product')

exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product',{
        pageTitle: 'Add Product',
        path : '/admin/add-product',
        editing : false,
        hasError : false,
        errorMessage : null,
        validationErrors : []
    })
}

exports.postAddProduct =(req,res,next)=>{
    const title = req.body.title
    const image = req.file
    const price = req.body.price
    const description = req.body.description
    if (!image){
        return res.status(422).render('admin/edit-product',{
            pageTitle : 'Add Product',
            path : '/admin/add-product',
            editing : false,
            hasError: true,
            product :{
                title : title,
                price : price,
                description: description
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).render('admin/edit-product',{
            pageTitle : 'Add Product',
            path : '/admin/add-product',
            editing : false,
            hasError: true,
            product :{
                title : title,
                price : price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
    const imageUrl = image.path

    const product = new Product({
        title :title,
        price : price,
        description : description,
        imageUrl: imageUrl,
        userId: req.user
    })
    product
        .save()
        .then(result=>{
            console.log('Created Product')
            res.redirect('/admin/products')
        })
        .catch(err=>{
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getEditProduct = (req,res,next)=>{
    const editMode = req.query.edit
    if (!editMode){
        return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId)
        .then(product => {
        if (!product){
            return res.redirect('/')
        }
        res.render('admin/edit-product',{
            pageTitle: 'Edit Product',
            path : '/admin/edit-product',
            editing : editMode,
            product : product,
            hasError : false,
            errorMessage: null,
            validationErrors: []
        })
        })
        .catch(err=>{
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

}

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId
    const updateTitle = req.body.title
    const updatePrice = req.body.price
    const image = req.file
    const updateDesc = req.body.description

    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.status(422).render('admin/edit-product',{
            pageTitle : 'Edit Product',
            path : '/admin/edit-product',
            editing : true,
            hasError: true,
            product :{
                title : updateTitle,
                price : updatePrice,
                description: updateDesc,
                _id : prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })

    }
    Product.findById(prodId)
        .then(product=>{
            if (product.userId.toString() !== req.body._id.toString()){
                return res.redirect('/')
            }
            product.title = updateTitle
            product.price = updatePrice
            product.description = updateDesc
            if (image){
                fileHelper.deleteFile(product.imageUrl)
                product.imageUrl = image.path
            }
            return product.save()
                .then(result=>{
                console.log('Updated Product')
                res.redirect('/admin/products')
        })
    })
        .catch(err=>{
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getProducts = (req,res,next)=>{
    Product.find({userId : req.user._id})
        //Just select your field you are asking for
        //.select('title price -_id')
        // first the path you want to populate and then select what you want
        //.populate('userId', 'name')
        .then(products=>{
            console.log(products)
        res.render('admin/products',{
            prods : products,
            pageTitle : 'Admin Products',
            path : '/admin/products'
        })
    }).catch(err=>{
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.deleteProduct = (req,res,next)=>{
    const prodId = req.params.productId
    Product.findById(prodId)
        .then(product=>{
            if (!product){
                return next(new Error('Product not found'))
            }
            fileHelper.deleteFile(product.imageUrl)
            return Product.deleteOne({ _id:prodId, userId : req.user._id })
        })
        .then(()=>{
            console.log('Destroyed Product')
            res.status(200).json({
                message : 'Success'
            })
        })
        .catch(err=>{
            res.status(500).json({
                message : 'Product Deleted failed'
            })
        })
}
