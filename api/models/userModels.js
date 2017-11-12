'use strict'

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	image: String,
	email: String,
	role: String,
	password: String,
});

module.exports = mongoose.model('User', UserSchema);