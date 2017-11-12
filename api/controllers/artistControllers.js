'use strict' 

//VARIABLES REQUERIDAS METODOS Y OBJETOS.
var fs = require('fs'),
	path = require('path'),
	//bcrypt = require('bcrypt-nodejs'),
	Artist = require('../models/artistModels'),
	Album = require('../models/albumModels'),
	Song = require('../models/songModels'),
	//jwt = require('../services/jwt'),
	mongoosePaginate = require('mongoose-pagination');


/*================================
=     prueba ARTISTAS            =
================================*/

function getArtist(req, res) {
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) => {
		
		if (err) {     
			res.status(500).send({message: 'Error en la petición'})
		}     
			else{ 
				if (!artist) {
					res.status(404).send({message: 'El artista no existe'})
				}else{
					res.status(200).send({artist})
				}//END ELSE	
			}//END ELSE IF
	})//END ARTIST FIND
	/*
	res.status(200).send({
		message : 'Probando servidor controlador artista.js'
	})
	*/
}

/*=====  End of ARTISTAS  ======*/

/*===================================
=            SAVE ARTIST            =
===================================*/

function saveArtist(req, res) {
	//CREAMOS EL OBJETO
	var artist = new Artist();

	//Ahora asignamos valores a cada uno de sus propiedades.-
	var params = req.body;

	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	var name = params.name;

	Artist.findOne({name: name}, (err, artist) => { //El callback nos puede dar un error o un objeto -> user

		if (err) {
			res.status(500).send({ message : 'Error en la petición' })
		}//END if error
		else{
			if (artist) {
				return res.status(404).send({ message : 'El artista ya existe en la base de datos' })
			}//END comprobación si llego el objeto correctamente
			else{
				var artist = new Artist();
				var params = req.body;
				artist.name = params.name;
				artist.description = params.description;
				artist.image = 'null';

				//RECIBIMOS UNA COSA ERROR O EL ARTISTA GUARDADO
				artist.save( (err, artistStored) => {
					if (err) {
						res.status(500).send({message: 'Error al guardar el artista.-'})
					}//END IF SAVE ARTIST
						else{
							if (!artistStored) {
								res.status(404).send({message: 'El artista no ha sido guardado.-'})
							}
								else{
									res.status(200).send({artist: artistStored})
								}//END ELSE
						}//END ELSE ARTIST SAVE
				});

			}//End else
		}//END comprobación si exite artista

	}); //ORM de mongoose, ademas el callback err-ok


}

/*=====  End of SAVE ARTIST  ======*/

/*===================================
=            LIST ARTIST            =
===================================*/

function getArtists(req, res) {
	// variables de paginación
	if (req.params.page) {
		var page = req.params.page;
	}else{
		page = 1;
	}
	var itemsPerPage = 3;

	Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) {
		// body...
		if (err) {
			res.status(500).send({message: 'Error en la petición.-'})
		}
			else{
				if (!artists) {
					res.status(404).send({message: 'No hay artistas!'})
				}//END IF
					else{
						return res.status(200).send({
							total_items: total,
							artists: artists	
						})
					}//END else
			}//END ELSE
	})//END ARTIST FIND

}

/*=====  End of LIST ARTIST  ======*/

/*=====================================
=            UPDATE ARTIST            =
=====================================*/

function updateArtist(req, res) {
	// body...
	var artistId = req.params.id;
	var update = req.body;
	delete update._id; // Remover el ID

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {

		if (err) {
			res.status(500).send({message: err+'Error en la petición.-'})
		}
			else{
				if (!artistUpdated) {
					res.status(404).send({message: 'El artistas no ha sido editado!'})
				}//END IF
					else{
						res.status(200).send({artist: artistUpdated})
					}//END else
			}//END ELSE

	})//END ARTIST
}

/*=====  End of UPDATE ARTIST  ======*/

/*=====================================
=            DELETE ARTIST            =
=====================================*/

function deleteArtist(req, res) {
	var artistId = req.params.id;

	

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición Artist.-'})	
		}//END IF err
		else{
			if (!artistRemoved) {
				res.status(404).send({message: 'El artistas no ha sido eliminado!'})
			}//end if else
			else{

				/* ELIMINAR TODO LOS ALBUMS Y CANCIONES DEL ARTISTA SEGÚN SU ID */
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=> {
					
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
										
										res.status(200).send({artist: artistRemoved})
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
				

			}//end else else
		}
	})//END ARTIST REMOVE
}

/*=====  End of DELETE ARTIST  ======*/

/*====================================
=            UPLOAD IMAGE            =
====================================*/

function uploadImageArtist(req, res) {
	var artistId = req.params.id;
	var file_name = 'No subido...';

	console.log(req.files.image+" url imagen")

			if (req.files.image !== undefined) {
		    	var file_path = req.files.image.path;
				var file_ext = path.extname(file_path),
		    		file_name = path.basename(file_path);

		    	if (file_ext == '.png' || file_ext == '.jpg') {
		    		Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {

		    		if (!artistUpdated) {
						res.status(404).send({ message : 'Error en la carga de la imagen!' })
					}
						else{
							res.status(200).send({ artist: artistUpdated})
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

function getImageArtistFile(req, res) {
	
	var imageFile = req.params.imageFile,
		path_image ='./uploads/artists/'+imageFile;

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
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImageArtist,
	getImageArtistFile
}