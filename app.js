const path = require('path')
const fs = require('fs')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const csrf = require('csurf')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const flash = require('connect-flash')
const multer = require('multer')
const MongoDBStore = require('connect-mongodb-session')(session)
//const expressHbs = require('express-handlebars')

const errorController = require('./controllers/error')
const shopController = require('./controllers/shop')
const protect = require('./middlewares/protect')

const User = require('./models/user')
const connectDB = require('./utils/database')

const MONGO_URI = 'mongodb+srv://10iguel:Carlczerny10@justdo.0xaby.mongodb.net/shop\n'

const app = express()

const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions'
})

const csrfProtection = csrf()

// const privateKey = fs.readFileSync('server.key')
// const certificate = fs.readFileSync('server.cert')

//diskStorege is an storage engine, two keys: destination and filename
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


//Template Engines Pug,handlebars,JES

//Template handlebars, how to use it and call the functions here , remember when you want to change the domain, use extname: (the name you want)
//app.engine('hbs',expressHbs({layoutsDir: 'views/layouts/',defaultLayout: 'main-layout',extname : 'hbs'}))
app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(helmet())
//Use compression to divide the size of the files
app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}))

app.use(bodyParser.urlencoded({extented: false}))
// You use dest in multer to concat the buffer
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
//to store the images not in the database
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
)
app.use(flash())

// Put <input type="hidden" name="_csrf" value="<%= csrfToken %>">
// in every view to make sure my website never get stolen.  You put that in every form.
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.post('/create-order', protect, shopController.postOrder)

app.use(csrfProtection)
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

//Error Page
app.get('/500', errorController.get500Page)

app.use(errorController.get404Page)

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    // res.redirect('/500');
    console.log(error)
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    })
})

connectDB()
const PORT = process.env.PORT || 3000

mongoose
    .connect(MONGO_URI)
    .then(result => {
        //http.createServer({key: privateKey, cert: certificate}, app).listen(3000)
        app.listen(PORT)
    })
    .catch(err => {
        console.log(err)
    })

