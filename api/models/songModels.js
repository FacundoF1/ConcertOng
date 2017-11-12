'use strict'

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SongSchema = Schema({
	number : String,
	name: String,
	description: String,
	duration: String,
	file: String,
	album: {type: Schema.ObjectId, ref: 'Album'}//Va ser referencia a otro objeto
});

module.exports = mongoose.model('Song', SongSchema);