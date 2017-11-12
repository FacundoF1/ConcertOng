'use strict'

var express = require('express'),
	AlbumController = require('../controllers/albumControllers.js'),
	api = express.Router(),
	md_auth = require('../middlewares/authenticated'),
	multipart = require('connect-multiparty'),
	md_upload = multipart({uploadDir: './uploads/albums/'});

api.get('/album/:id',md_auth.ensureAuth,AlbumController.getAlbum);
api.post('/album/add',md_auth.ensureAuth,AlbumController.saveAlbum);
api.get('/albums/:artist?',md_auth.ensureAuth,AlbumController.getAlbums);
api.put('/album/update/:id',md_auth.ensureAuth,AlbumController.updateAlbum);
api.delete('/album/delete/:id',md_auth.ensureAuth,AlbumController.deleteAlbum);
api.post('/upload-image-album/:id',[md_auth.ensureAuth, md_upload], AlbumController.uploadImageAlbum);
api.get('/get-image-album/:imageFile', AlbumController.getImageAlbumFile);
/*
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
*/
module.exports = api;