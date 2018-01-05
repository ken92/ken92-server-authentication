const passport = require('passport');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

// "session: false" means "don't make a session for this authentication"
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {
	app.get('/', requireAuth, function(req, res) {
		res.send({message: 'Super secret code is abc123'});
	});
	app.post('/signin', requireSignin, Authentication.signin);
	app.post('/signup', Authentication.signup);
}
