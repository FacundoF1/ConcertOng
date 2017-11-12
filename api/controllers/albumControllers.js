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
=     prueba ALBUM               =
================================*/

function getAlbum(req, res) {

	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
		
		if (err) {     
			res.status(500).send({message: 'Error en la petición'})
		}     
			else{ 
				if (!album) {
					res.status(404).send({message: 'El album no existe'})
				}else{
					res.status(200).send({album})
				}//END ELSE	
			}//END ELSE IF
	
	})//END ARTIST FIND
	
}

/*=====  End of ALBUM     ======*/


/*=====================================
=            SEARCH ALBUMS            =
=====================================*/

function getAlbums(req, res) {
	var artistId = req.params.id;
	if (!artistId) {
		//Sacamos todos los albums guardados en sistema
		var find = Album.find({}).sort('title')
	}
	else{
		//Sacamos el album solo del artista por su id
		var find = Album.find({artist: artistId}).sort('year')
	}

	//Usamos populate para listar cada uno de los artista segun sus propiedades
	find.populate({path: 'artist'}).exec((err, albums) => {
		if (err) {     
			res.status(500).send({message: 'Error en la petición'})
		}     
			else{ 
				if (!albums) {
					res.status(404).send({message: 'El albums no existe'})
				}else{
					res.status(200).send({albums})
				}//END ELSE	
			}//END ELSE IF

	})

}

/*=====  End of SEARCH ALBUMS  ======*/


/*==========================================
=            GUARDAR SAVE ALBUM            =
==========================================*/

function saveAlbum(req, res) {
	
	var album = new Album();

	var	params = req.body;
		album.title = params.title;
		album.description = params.description;
		album.year = params.year;
		album.image = 'null';
		album.artist = params.artist;

	album.save((err, albumStored) =>{
		if (err) {
			res.status(500).send({message: 'Error en la petición al servidor.-'})
		}//END IF Save
		else{
			if (!albumStored) {
				res.status(404).send({message: 'No se ha guardado el Album!'})
			}//END If else
			else{
				res.status(200).send({album: albumStored})
			}//end else else
		}//END ELSE Save
	})

}

/*=====  End of GUARDAR SAVE ALBUM  ======*/

/*====================================
=            UPDATE ALBUM            =
====================================*/

function updateAlbum(req,res) {
	
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición al servidor.-'})
		}//END IF Save
		else{
			if (!albumUpdated) {
				res.status(404).send({message: 'No se ha podido actualizar el Album!'})
			}//END If else
			else{
				res.status(200).send({album: albumUpdated})
			}//end else else
		}//END ELSE Save
	})


}

/*=====  End of UPDATE ALBUM  ======*/
	

/*=====================================
=            DELETE ALBUMS            =
=====================================*/

function deleteAlbum(req, res) {
	var albumId = req.params.id;

	/* ELIMINAR TODO LOS ALBUMS Y CANCIONES DEL ARTISTA SEGÚN SU ID */
	Album.findByIdAndRemove(albumId, (err, albumRemoved)=> {
					
		if (err) {
			res.status(500).send({message: 'Error en la petición Album.-'})
		}//END if err
		else{
			if (!albumRemoved) {
				res.status(404).send({message: 'El album no ha sido eliminado!'})
			}//END IF ELSE
			else{

				/* ELIMINAR CANCIÓN SONG */
				Song.find({album: albumRemoved._id}).remove((err, songRemoved)=> {
								
					if (err) {
						res.status(500).send({message: 'Error en la petición Canción.-'})
					}//END if err
					else{
						if (!songRemoved) {
							res.status(404).send({message: 'La Canción no ha sido eliminada!'})
						}//END IF ELSE
						else{
							/* ELIMINAMOS EL ARTISTA SI YA ELIMINÓ TODO LO ANTERIOR. */
										
							res.status(200).send({album: albumRemoved})
							console.log("Se ha eliminado todo")
							/* END - ELIMINAR ALBUM-SONG-ARTIST */
									
						}//END IF ELSE
					}//END ELSE IF

				})//end remove
				/* END - ELIMINAR CANCIÓN SONG */
						
			}//END IF ELSE
		}//END ELSE IF

	})//end remove ALBUM
	/* END - ELIMINAR ALBUMS Y CANCIONES */	
}

/*=====  End of DELETE ALBUMS  ======*/


/*====================================
=            UPLOAD IMAGE            =
====================================*/

function uploadImageAlbum(req, res) {
	var albumId = req.params.id;
	var file_name = 'No subido...';

	console.log(req.files.image+" url imagen")

			if (req.files.image !== undefined) {
		    	var file_path = req.files.image.path;
				var file_ext = path.extname(file_path),
		    		file_name = path.basename(file_path);

		    	if (file_ext == '.png' || file_ext == '.jpg') {
		    		Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {

		    		if (!albumUpdated) {
						res.status(404).send({ message : 'Error en la carga de la imagen del album!' })
					}
						else{
							res.status(200).send({ album: albumUpdated})
						}//ENd else userudated

		    		})
		    	}//END IF EXT
		    	else{
		    		res.status(200).send({ message : 'Extension no válida' })
		    	}//END EXTENSION
		    }//END IF
		    else{
		    	return res.status(200).send({message : 'No ha subido ningúna imagen...'})
		    }//END ELSE

}

/*=====  End of UPLOAD IMAGE  ======*/

/*===================================
=            ROUTE IMAGE            =
===================================*/

function getImageAlbumFile(req, res) {
	
	var imageFile = req.params.imageFile,
		path_image ='./uploads/albums/'+imageFile;

	//Arreglo mi autoria
	fs.open(path_image, 'r', (err, fd) => {
		if (err) {
			 if (err.code === 'ENOENT') {
				console.log('El archivo no existe');
				res.status(200).send({ message : 'No existe la imagen...' })
				return;
			}
		throw err;
		}
		else{
			res.sendFile(path.resolve(path_image));
		}
	});

}

/*=====  End of ROUTE IMAGE  ======*/

/* PARA PODER UTILIZAR LOS METODOS QUE SE CREEN EN EL CONTROLADOR SE GENERAN OBJETOS PARA EXPORTADOS */
module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImageAlbum,
	getImageAlbumFile
}