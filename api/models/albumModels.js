'use strict'

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: {type: Schema.ObjectId, ref: 'Artist'}//Va ser referencia a otro objeto
});

module.exports = mongoose.model('Album', AlbumSchema);