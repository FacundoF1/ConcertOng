'use strict'

var express = require('express'),
	SongController = require('../controllers/songControllers.js'),
	api = express.Router(),
	md_auth = require('../middlewares/authenticated'),
	multipart = require('connect-multiparty'),
	md_upload = multipart({uploadDir: './uploads/songs/'});

api.get('/song/:id',md_auth.ensureAuth,SongController.getSong);
api.get('/songs/:album?',md_auth.ensureAuth,SongController.getSongs);
api.post('/song/add',md_auth.ensureAuth,SongController.saveSong);
api.put('/song/update/:id',md_auth.ensureAuth,SongController.updateSong);
api.delete('/song/delete/:id',md_auth.ensureAuth,SongController.deleteSong);
api.post('/song/upload-file/:id',[md_auth.ensureAuth, md_upload], SongController.uploadSongFile);
api.get('/song/get-song/:songFile', SongController.getSongFile);


module.exports = api;