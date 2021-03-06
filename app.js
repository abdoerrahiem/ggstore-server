const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const cors = require('cors')

const usersRouter = require('./src/routes/users')
const dashboardRouter = require('./src/routes/dashboard')
const categoryRouter = require('./src/routes/category')
const nominalRouter = require('./src/routes/nominal')
const voucherRouter = require('./src/routes/voucher')
const bankRouter = require('./src/routes/bank')
const paymentRouter = require('./src/routes/payment')
const transactionRouter = require('./src/routes/transaction')
const playersRouter = require('./src/routes/players')
const playerRouter = require('./src/routes/player')
const authRouter = require('./src/routes/auth')

const app = express()

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
)
app.use(flash())
app.use(methodOverride('_method'))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  '/adminlte',
  express.static(path.join(__dirname, '/node_modules/admin-lte/'))
)

app.use('/', usersRouter)
app.use('/dashboard', dashboardRouter)
app.use('/category', categoryRouter)
app.use('/nominal', nominalRouter)
app.use('/voucher', voucherRouter)
app.use('/bank', bankRouter)
app.use('/payment', paymentRouter)
app.use('/transaction', transactionRouter)
app.use('/players', playersRouter)

//API
app.use('/api/v1/players', playerRouter)
app.use('/api/v1/auth', authRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
