const settings = require('./settings')
global.S = settings

const logger = require('./logger')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
require('dotenv').config();
let tools = require('./tools')

// console.log('dotenv', process.env)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/user');
var adminRouter = require('./routes/api/admin');

var app = express();

// Enabling trust proxy
app.enable('trust proxy')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// create a rotating write stream
var rfs = require('rotating-file-stream') 
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'runtime/logs')
})
app.use(morgan('combined', { stream: accessLogStream }));

// req body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// order sensitive
app.use('/api/user', usersRouter);
app.use('/api/panel', adminRouter);
app.use('/api', indexRouter);
// app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function (err, req, res, next) {
//   if (err.name === "UnauthorizedError") {
//     res.json(tools.jsonFail('invalid token', 401))
//     
//   } else {
//     next(err);
//   }
// });


app.use(function (err, req, res, next) {
  // error log to file
  logger.error(err.stack);
  
  if (err.name === "UnauthorizedError") {
    res.json(tools.jsonFail("invalid token", 401));
  } else {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    // res.status(err.status || 500);
    // res.render('error');
    res.json(
      tools.jsonFail(
        req.app.get("env") === "development" ? err.message : "system error",
        err.status || 500
      )
    );
  }
});

module.exports = app;
