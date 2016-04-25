const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Routes
const routes = require('./routes/index');
const provider = require('./routes/provider');
const icon = require('./routes/icon');
const auth = require('./routes/auth');

const app = express();

// Configuring Passport
const passport = require('passport');
const expressSession = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// middlewares
app.use(logger('dev'));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(expressSession({
    secret: 'voicein-secret-key-hswirq1',
    resave: true,
    saveUninitialized: true,
  }));
app.use(passport.initialize());
app.use(passport.session());

// static resources
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));

console.log(__dirname);
const flash = require('connect-flash');
app.use(flash());

// route
app.use('/', routes);
app.use('/qrcode', provider);
app.use('/icon', icon);
app.use('/auth', auth);

const accpuntRoutes = require('./routes/account')(passport);
app.use('/account', accpuntRoutes);

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
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
