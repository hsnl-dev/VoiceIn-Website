const express = require('express');
const debug = require('debug')('app:appjs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dbConfig = require('./config/db.js').production;
const mongoose = require('mongoose');
const flash = require('connect-flash');

mongoose.connect(dbConfig.url);

// Routes
const routes = require('./routes/index');
const provider = require('./routes/provider');
const icon = require('./routes/icon');
const validation = require('./api-route/v1/validation-resource');
const alpha = require('./routes/alpha');
const app = express();

// Configuring Passport
const passport = require('passport');
const expressSession = require('express-session');
const MemcachedStore = require('connect-memcached')(expressSession);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', true);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// middlewares
app.use(logger('dev'));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

var sessionConfig = {
    secret: 'voicein-secret-key-hswirq1',
    resave: false,
    saveUninitialized: false,
    signed: true,
  };

if (process.env.NODE_ENV === 'production') {
  sessionConfig.store = new MemcachedStore({
    hosts: ['127.0.0.1:11211'],
  });
}

app.use(expressSession(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// static resources
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use('/.well-known', express.static(path.join(__dirname, '/.well-known')));

console.log(__dirname);

// route
app.use('/', routes);
app.use('/qrcode', provider);
app.use('/icon', icon);

// temporary route for test user.
app.use('/alpha', alpha);

const accountRoutes = require('./routes/account')(passport);

app.use('/account', accountRoutes);

// API Route
app.use('/api/v1/validations', validation);

// Initialize Passport
const initPassport = require('./passport/init');

initPassport(passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');

  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    debug(err.message);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  debug(err.message);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
