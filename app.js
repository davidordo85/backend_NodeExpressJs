var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var app = express();
require('./models/connectMongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

app.locals.title = 'Backend compra ventas Node.js';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes Api
 */

app.use('/api/v1/products', require('./routes/api/products'));
app.use('/api/v1/user', require('./controller/auth'));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // Set locals to provide error details in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Log the error for debugging purposes
  console.error(err);

  // Render an appropriate error response
  res.status(err.status || 500);

  // Send JSON response for API routes
  if (req.originalUrl.startsWith('/api/')) {
    res.json({ error: err.message });
  } else {
    // Render error page for other routes
    res.render('error');
  }
});

module.exports = app;
