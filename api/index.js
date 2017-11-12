'use strict'

var mongoose = require('mongoose'),
	app = require('./app'),
	port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean',{ useMongoClient: true }, (err, res) => {
	if (err) {
		throw err
	}else{
		console.log("base de datos está funcionando correctectamente");

		app.listen(port, function () {
			console.log('Servidor api rest de música. '+port);
		})
	}
});