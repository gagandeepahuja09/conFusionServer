var express = require('express');
const bodyParser = require('body-parser');

var router = express.Router();
router.user(body-parser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// The username will be in the username
router.post('/signup',(req, res, next) => {
	// First check whether user with this username exists or not
	User.findOne({ username : req.body.username })
	.then((user) => {
		// User exists
		if(user != null) {
			var err = new Error('User' + req.body.username + 
			' already exists');
			err.status = 403;
		}
		else {
			return User.create({
				username: req.body.username,
				password: req.body.password,
			});
		}
	})
	// When a new user is created
	.then((user) => {
		res.statusCode = 200;
		res.setHeader('Content-type', 'application/json');
		res.json({ status: 'Registration successful!', user: user });
	}, (err) => next(err))
	.catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
	// When user is not logged in
	if(!req.session.user) {
		var authHeader = req.session.authorization;
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

		// We will check whether user with given username and password 
		// Exists in our database
		User.findOne({ username : username })
		.then((user) => {
			if(user === null) {
				var err = new Error('User ' + username + ' does not exist');
				res.setHeader('WWW-Authenticate', 'Basic');
				err.status = 403;
				return next(err);
			}
			else if(user.password !== password) {
				var err = new Error('Your password is incorrect');
				err.status = 403;
				return next(err);
			}
			else {
				// Set up the session => Log him in for some time(till expires)
				req.session.user = 'authenticated';
				res.statusCode = 200;
				res.setHeader('Content-type', 'text/plain');
				res.end('You are authenticated');				
			}
		})
		.catch((err) => next(err));	
	}
	else {
		res.statusCode = 200;
		res.setHeader('Content-type', 'text/plain');
		res.end('You are authenticated');
	}
});

// Previous 2 were post but this is get we do not need to supply username
// and password as server is already tracking us.
router.get('/logout', (req, res, next) => {

});

module.exports = router;
