'use strict'

var jwt = require('jwt-simple'),
	moment = require('moment'),
	secret = 'clave_secreta_curso';

exports.createToken = function(user) {
	// aca le vamos a pasar nuestro usuario

	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(14, 'days').unix
	};

	return jwt.encode(payload, secret);
}; 
	