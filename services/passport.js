const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config');
const LocalStrategy = require('passport-local');


// ---- SIGN IN ----
// create local strategy
// it handles 'password' automatically
// it expects 'username' property but our username is email
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// verify email and password
	// if correct, call done with user
	// if not, call done with false
	User.findOne({email: email}, function(err, user) {
		if (err) return done(err);
		if (!user) return done(null, false);

		// compare passwords
		user.comparePassword(password, function(err, isMatch) {
			if (err) return done(err);
			if (!isMatch) return done(null, false);
			return done(null, user);
		});
	});
});


// set options for jwt strategy
const jwtOptions = {
	// look at the header to find the token
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),

	// what secret to use
	secretOrKey: config.secret
};


// ---- AUTHENTICATE WITH TOKEN ----
// create jwt strategy
// payload: decoded jwt token
// done: callback function
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// called every time we need to authenticate a token
	// see if user id in payload exists in db
	// if so, call done with the user
	// otherwise, call done without a user

	User.findById(payload.sub, function(err, user) {
		if (err) return done(err, false);
		if (user)
			done(null, user);
		else
			done(null, false);
	});
});


// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
