//FICHERO DE RUTA
'use strict'

/* VARIABLES */
var express = require('express'),
	ArtistController = require('../controllers/artistControllers.js'),
	api = express.Router(),
	md_auth = require('../middlewares/authenticated'),
	multipart = require('connect-multiparty'),
	md_upload = multipart({uploadDir: './uploads/artists'});
	

/* RUTAS */
api.get('/artist/:id',md_auth.ensureAuth,ArtistController.getArtist);
api.get('/artists/:page?',md_auth.ensureAuth,ArtistController.getArtists);
api.post('/artist/add',md_auth.ensureAuth,ArtistController.saveArtist);
api.put('/artist/:id',md_auth.ensureAuth,ArtistController.updateArtist);
api.delete('/artist/:id',md_auth.ensureAuth,ArtistController.deleteArtist);
api.post('/upload-image-artist/:id',[md_auth.ensureAuth, md_upload],ArtistController.uploadImageArtist);
api.get('/get-image-artist/:imageFile', ArtistController.getImageArtistFile);

/*
api.get('/probando-controlador',md_auth.ensureAuth,UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
*/

module.exports = api;