const Product = require('../models/product')

exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product',{
        pageTitle: 'Add Product',
        path : '/admin/add-product',
        editing : false,
        isAuthenticated : req.session.isLoggedIn
    })
}

exports.postAddProduct =(req,res,next)=>{
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const product = new Product({
        title :title,
        imageUrl : imageUrl,
        description : description,
        price :price,
        userId : req.user
    })
    product
        .save()
        .then(result=>{
            console.log('Created Product')
            res.redirect('/admin/products')
        })
        .catch(err=>{
            console.log(err)
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
            isAuthenticated : req.session.isLoggedIn
        }).catch((err)=>{
            console.log(err)
        })
    })
}

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId
    const updateTitle = req.body.title
    const updatePrice = req.body.price
    const updateImageUrl = req.body.imageUrl
    const updateDesc = req.body.description

    Product.findById(prodId)
        .then(product=>{
            product.title = updateTitle
            product.price = updatePrice
            product.imageUrl = updateImageUrl
            product.description = updateDesc
            return product.save()
        })
        .then(result=>{
        console.log('Updated Product')
        res.redirect('/admin/products')
    })
        .catch(err=>{
        console.log(err)
    })
}

exports.getProducts = (req,res,next)=>{
    Product.find()
        //Just select your field you are asking for
        //.select('title price -_id')
        // first the path you want to populate and then select what you want
        //.populate('userId', 'name')
        .then(products=>{
            console.log(products)
        res.render('admin/products',{
            prods : products,
            pageTitle : 'Admin Products',
            path : '/admin/products',
            isAuthenticated : req.session.isLoggedIn
        })
    }).catch((err)=>{
        console.log(err)
    })
}

exports.postDeleteProduct = (req,res,next)=>{
    const prodId = req.body.productId
    Product.findByIdAndDelete(prodId)
        .then(()=>{
            console.log('Destroyed Product')
            res.redirect('/admin/products')
        })
        .catch(err=>{
            console.log(err)
        })
}
