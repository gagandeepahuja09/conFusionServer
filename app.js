var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
	console.log('Connected correctly to the server');
}, (err) => {
	console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));

function auth(req, res, next) {
	console.log(req.headers);

	var authHeader = req.headers.authorization;

	// If there is no user of cookie
	// Basically logged out
	if(!req.signedCookies.user) {
		var authHeader = req.cookies.authorization;
		// If authorization body is empty
		// User is not logged in.
		if(!authHeader) {
			var err = new Error('You are not authenticated!');
			res.setHeader('WWW-Authenticate', 'Basic');
			err.status = 401;
			next(err);
		}

		// first element would be the word Basic
		// we don't need that
		// : separates the username and password
		var auth = new Buffer.from(authHeader.split(' ')[1], 'base64')
		.toString().split(':');

		var username = auth[0];
		var password = auth[1];

		if(username === 'admin' && password === 'password') {
		// Set up the cookie => Log him in for some time(till expires)
			res.cookie('user', 'admin', { signed : true });
			next(); // Authorized so go to next middleware
		}
		else {
			var err = new Error('You are not authenticated!');
			res.setHeader('WWW-Authenticate', 'Basic');
			err.status = 401;
			next(err);		
		}	
	}
	// Currently logged in 
	// User property of cookie exists
	else {
		// Check the username
		if(req.signedCookies.user == 'admin') {
			next();
		}
		else {
			var err = new Error('You are not authenticated');
			err.status(401);
			next(err);
		}
	}
}

//Before serving static pages & b4 all these routes we need to authorize
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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
