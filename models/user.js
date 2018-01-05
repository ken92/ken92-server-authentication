const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema; // used to tell mongoose about particular model fields

// define user model
const userSchema = new Schema({
	email: {type: String, unique: true, lowercase: true},
	password: String
});


// on save hook, encrypt password
userSchema.pre('save', function(next) {
	const user = this;

	// generate salt
	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);

		// hash the password with the salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});


userSchema.methods.comparePassword = function(candidatePassword, callback) {
	// this.password = hashed and salted password
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
}


// create model class
const modelClass = mongoose.model('user', userSchema);


// export the model
module.exports = modelClass;
