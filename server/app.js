const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const indexRouter = require('./routes/index');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');

// conectando a la bd
require('./config/database');

// configuracion passport
const passportSetup = require('./config/passport');
passportSetup(passport);

const app = express();

// configuracion cors
var whitelist = [
  'http://localhost:3001',
];

var corsOptions = {
  origin: function(origin, callback){
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
  },
  credentials: true
};
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// configuracion session
app.use(session({
  secret: 'react auth passport secret shh',
  resave: true,
  saveUninitialized: true,
  cookie : { httpOnly: true, maxAge: 2419200000 }
}));

// inicializando modulos de auth
//require('./passport')(app);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api', authRoutes);
app.use('/api', orderRoutes);

// url por defecto, cuando no se encuentra algo
app.use((req, res, next) => {
  res.sendfile(__dirname + '/public/index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
