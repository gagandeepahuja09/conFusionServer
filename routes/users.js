var express = require('express');
const bodyParser = require('body-parser');

var router = express.Router();
router.user(body-parser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// The username will be in the username
router.post('/signup', function(req, res, next) {
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

module.exports = router;
