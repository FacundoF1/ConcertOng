'use strict'

var express = require('express'); 
var	bodyParser = require('body-parser');
var	app = express(); 

	//cargar rutas
	var user_routes = require('./routes/userRoute'),
		artist_routes = require('./routes/artistRoute'),
		song_routes = require('./routes/songRoute'),
		album_routes = require('./routes/albumRoute');

	//metodos exportados de body-parser
	app.use(bodyParser.urlencoded({extended:false}));//es necesario para que body funcione
	app.use(bodyParser.json());//convierte los datos que nos llegan por peticion http a json

	//configurar cabeceras http: Esto se realiza para no tener problemas con la peticiones ajax. Se configura el middleware.
	app.use((req, res, next)=>{
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
		res.header('Access-Control-Allow-Methods',  'GET, POST, OPTIONS, PUT, DELETE');
		res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE'); 
	 next();
	});

	//rutas base
	app.use('/api', user_routes);
	app.use('/api', artist_routes);
	app.use('/api', album_routes);
	app.use('/api', song_routes);


module.exports = app;