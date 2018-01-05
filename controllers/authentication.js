const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	// sub = subject
	// iat = issued at time
	// sub and iat are convention
	return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password)
		return res.status(422).send({error: 'You must provide an email and password!'});

	// see if user with given email exists
	User.findOne({email: email}, function(err, existingUser) {
		if (err) return next(err);

		// if user with email exists, return error
		if (existingUser) {
			return res.status(422).send({error: 'Email is in use'});
		}

		// if email does not exist, create and save new user
		const user = new User({
			email: email,
			password: password
		});
		user.save(function(err) {
			if (err) return next(err);

			// respond to request with success
			res.json({token: tokenForUser(user)});
		});

	});
}

exports.signin = function(req, res, next) {
	// user has already had email and password authenticated
	// just give them a token
	res.send({token: tokenForUser(req.user)});
}
