'use strict' 

//VARIABLES REQUERIDAS METODOS Y OBJETOS.
var fs = require('fs'),
	path = require('path'),
	//bcrypt = require('bcrypt-nodejs'),
	Artist = require('../models/artistModels'),
	Album = require('../models/albumModels'),
	Song = require('../models/songModels'),
	
	mongoosePaginate = require('mongoose-pagination');


/*================================
=     prueba SONG               =
================================*/

function getSong(req, res) {


	var songId = req.params.id;

	Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
		
		if (err) {     
			res.status(500).send({message: 'Error en la petición'})
		}     
			else{ 
				if (!song) {
					res.status(404).send({message: 'La canción no existe'})
				}else{
					res.status(200).send({song})
				}//END ELSE	
			}//END ELSE IF
	
	})//END ARTIST FIND

	
}

/*=====  End of SONG     ======*/


/*=====================================
=            SEARCH SONG           =
=====================================*/

function getSongs(req, res) {
	var albumId = req.params.id;
	if (!albumId) {
		//Sacamos todos los albums guardados en sistema
		var find = Song.find({}).sort('number')
	}
	else{
		//Sacamos el album solo del artista por su id
		var find = Song.find({album: albumId}).sort('number')
	}

	//Usamos populate para listar cada uno de los artista segun sus propiedades
	find.populate({
			path: 'album',
			populate:{
				path: 'artist',
				model: 'Artist'
			}
		}).exec((err, songs) => {
		if (err) {     
			res.status(500).send({message: 'Error en la petición'})
		}     
			else{ 
				if (!songs) {
					res.status(404).send({message: 'El albums no existe'})
				}else{
					res.status(200).send({songs})
				}//END ELSE	
			}//END ELSE IF

	})

}

/*=====  End of SEARCH SONG  ======*/

/*=================================
=            SAVE SONG            =
=================================*/

function saveSong(req, res) {
	
	var song = new Song();
	var params = req.body;

	song.name = params.name;
	song.description = params.description;
	song.number = params.number;
	song.duration = params.duration;
	song.file = 'null';
	song.album = params.album;

	song.save((err, songStored) => {
		
		if (err) {
			res.status(500).send({message: 'Error en la petición al servidor.-'})
		}//END IF Save
		else{
			if (!songStored) {
				res.status(404).send({message: 'No se ha guardado el Album!'})
			}//END If else
			else{
				res.status(200).send({song: songStored})
			}//end else else
		}//END ELSE Save

	})

}

/*=====  End of SAVE SONG  ======*/

/*====================================
=            UPDATE Song            =
====================================*/

function updateSong(req,res) {
	
	var songId = req.params.id;
	var update = req.body;

	//SONG. -> permitimos realizar acciones en el metodo generado
	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición al servidor.-'})
		}//END IF Save
		else{
			if (!songUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar la canción!'})
			}//END If else
			else{
				res.status(200).send({song: songUpdated})
			}//end else else
		}//END ELSE Save
	})
}

/*=====  End of UPDATE Song  ======*/

/*=====================================
=            DELETE SONGSS            =
=====================================*/

function deleteSong(req, res) {
	var songId = req.params.id;

	/* ELIMINAR TODO LOS ALBUMS Y CANCIONES DEL ARTISTA SEGÚN SU ID */
	Song.findByIdAndRemove(songId, (err, songRemoved)=> {
					
		if (err) {
			res.status(500).send({message: 'Error en la petición Canción.-'})
		}//END if err
			else{
				if (!songRemoved) {
					res.status(404).send({message: 'La Canción no ha sido eliminada!'})
				}//END IF ELSE
				else{
					/* ELIMINAMOS EL ARTISTA SI YA ELIMINÓ TODO LO ANTERIOR. */
										
					res.status(200).send({song: songRemoved})
					console.log("Se ha eliminado todo")
					/* END - ELIMINAR ALBUM-SONG-ARTIST */
									
				}//END IF ELSE
			}//END ELSE IF
	})//end remove ALBUM
	/* END - ELIMINAR ALBUMS Y CANCIONES */	
}

/*=====  End of DELETE SONGSS  ======*/

/*====================================
=            UPLOAD SONGSS           =
====================================*/
function uploadSongFile(req, res) {
	
	var songId = req.params.id;
	var file_name = 'No subido...';

	console.log(req.files.file+" url song")

			if (req.files.file.path !== "") {
		    	var file_path = req.files.file.path;
				var file_ext = path.extname(file_path),
		    		file_name = path.basename(file_path);

		    		console.log(file_ext+' ruta cancion')

		    	if (file_ext == '.mp3' || file_ext == '.ogg') {
		    		Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {

		    		if (!songUpdated) {
						res.status(404).send({ message : 'Error en la carga del archivo!' })
					}
						else{
							res.status(200).send({ song: songUpdated})
							console.log('subido la cancion')
						}//ENd else userudated

		    		})
		    	}//END IF EXT
		    	else{
		    		res.status(200).send({ message : 'Extension no válida' })
		    	}//END EXTENSION
		    }//END IF
		    else{
		    	return res.status(200).send({message : 'No ha subido ningún arvhivo...'})
		    }//END ELSE

}

/*=====  End of UPLOAD SONGSS  ======*/

/*===================================
=            ROUTE SONGS            =
===================================*/

function getSongFile(req, res) {
	
	var songFile = req.params.songFile,
		path_song ='./uploads/songs/'+songFile;

	//Arreglo mi autoria
	fs.open(path_song, 'r', (err, fd) => {
		if (err) {
			 if (err.code === 'ENOENT') {
				console.log('El archivo no existe');
				res.status(200).send({ message : 'No existe el audio...' })
				return;
			}
		throw err;
		}
		else{
			res.sendFile(path.resolve(path_song));
		}
	});

}

/*=====  End of ROUTE SONGS  ======*/

/* PARA PODER UTILIZAR LOS METODOS QUE SE CREEN EN EL CONTROLADOR SE GENERAN OBJETOS PARA EXPORTADOS */
module.exports = {
	getSong,
	getSongs,
	updateSong,
	deleteSong,
	saveSong,
	uploadSongFile,
	getSongFile
	
}