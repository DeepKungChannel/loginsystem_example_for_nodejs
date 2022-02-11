const port = process.env.PORT || 5000;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host:'----------------------------------',
  user: '----------------------------------',
  password: '----------------------------------',
  database:'----------------------------------'
});
// var connection2 = mysql.createConnection({
//   host : 'eu-cdbr-west-03.cleardb.net',
//   port : 3306,
//   user: 'ba0571b0b1c4a1',
//   password: '609531d0',
//   database: 'heroku_cc914cb7bdd2de0'
// })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addrouter = require('./routes/add');
var editrouter = require('./routes/edit');
var MySQLStore = require('express-mysql-session')(session);

var app = express();

// view engine setup


// db to store session
app.use(session({
  secret : '----------------------------------',
  resave : false,
  saveUninitialized : true,
  store : new MySQLStore({
    host : '----------------------------------',
    port : 3306,
    user: '----------------------------------',
    password: '----------------------------------',
    database: '----------------------------------'
  }),
  cookie :{
    maxAge : (1000 * 60 * 60 * 24 * 30)
  }
}));

app.listen(port, () => console.log('app listen on port '+port))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/add',addrouter);
app.use('/edit',editrouter);



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
