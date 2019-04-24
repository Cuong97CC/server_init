const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const config = require('./config/config');

const cors = require('cors');
const app = express();

const userRouter = require('./app/routers/userRouter');

const env = process.env.NODE_ENV || 'development';
console.log(env)
mongoose.connect(config.db[env], {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true
});

const conn = mongoose.connection;
app.set('superSecret', config.secret);

conn.once('open', function () {
  console.log('connected mongodb');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/user", userRouter);

app.use("/", function(req, res) {
  res.send("Welcome!");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
