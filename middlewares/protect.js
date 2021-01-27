const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/user')

exports.protect = (req,res,next) => {
    if (!req.session.isLoggedIn){
        res.redirect('/login')
    }
    next(new ErrorResponse('No authorize for this man, get away',401))
}
