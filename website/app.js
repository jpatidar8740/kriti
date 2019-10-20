var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const FileStore = require('session-file-store')(session);

var flash = require('req-flash');
var fileUpload = require('express-fileupload');
var admin = require('./config/firebaseConfig');
// config cloudinary
var cloudinary = require('./cloudinary/config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var organizationRouter = require('./routes/organization');

var app = express();

// view engine setup
var exphbs = require('express-handlebars');

// Use `.hbs` for extensions and find partials in `views/partials`.

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ defaultLayout: 'index', extname: '.hbs' }));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: "Shh, its a secret!",
  saveUninitialized: true,
  store: new FileStore(),
  resave: true,
  cookie: {}
}));

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: '/home/jayant/Desktop/Kriti/website/tmp'
}));

app.use('/', (req, res, next) => {

  if (req.session.is_auth) {
    //console.log("Req after log in");
    res.locals.logged_in = true;
    if (req.session.is_org) {
      res.locals.is_org = true;
    }
    else {
      res.locals.is_org = false;
    }
  }
  else {
    //console.log("Before after log in");
    res.locals.logged_in = false;
  }
  res.locals.session = req.session;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/organization', organizationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
