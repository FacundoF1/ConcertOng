'use strict' 

var fs = require('fs');
var	path = require('path');
var	bcrypt = require('bcrypt-nodejs');
var	User = require('../models/userModels');
var	User_Register = require('../models/userModels');
var	jwt = require('../services/jwt');

function pruebas(req, res) {
	res.status(200).send({
		message : 'Probando servidor controlador todo junto cheraa'
	})
}


/*================================
=            REGISTER            =
================================*/

function saveUser(req, res) {
	var user = new User();
	var params = req.body;
	
	var name = params.name;
	var surname = params.surname;
	var	email = params.email;
	var password = params.password;
	var role = params.role;
	var image = params.image;

	User.findOne({email: email}, (err, user) => { //El callback nos puede dar un error o un objeto -> user

		if (err) {
			res.status(500).send({ message : 'Error en la petición' })
		}//END if error
		else{
			if (user) {
			 	res.status(404).send({ message : 'El email ingresado ya existe en base de datos' })
			}//END comprobación si llego el objeto correctamente
			else{
				
				/* REGISTRO */
				var user = new User();
				//cada una de estas variables viene por POST 
				user.name = name;
				user.surname = surname;
				user.email = email;
				user.password = password;
				user.role = 'ROLE_USER';
				user.image = 'null';
				
				if(password && email && name && surname){

					bcrypt.hash(params.password, null, null, function(err, hash) {
														
						if ( name != null && surname != null && email != null) {

							user.password = hash;
							
							user.save((err, userStored) => {
								if (err) {
									res.status(500).send({ message : 'Error al guardar el usuario' })
								}else{
									if (!userStored) {
										res.status(404).send({ message : 'No se ha registrado el usuario' })
									}else{
										res.status(200).send({user: userStored}); 
										console.log(user+" Usuario registrado")
									}
								}
							});
						}//END condicionales de campos si existen
						else{
							res.status(404).send({message : 'Ingrese todos los campos!'})
						}//END mensaje por defecto de condicional
					})//END bcrypt
				}
				else{
					res.status(404).send({message : 'Ingrese los datos para registrar los datos ELSE ID'})
				}//END mensaje defecto de contraseña
				
				/* REGISTRO */	

			}//End else *
		}//END comprobación si exite o no usuario

	}); //ORM de mongoose, ademas el callback err-ok	

}//función para guardar un usuario

/*=====  End of REGISTER  ======*/


/*===================================
=            LOGIN USERS            =
===================================*/

function loginUser(req, res) {
	var user = new User();
	var params = req.body;// -body -> bodyparser- los datos que nos llegan lo convertimos en objetos json
	var	email = params.email;
	var password = params.password;

	User.findOne({email: email}, (err, user) => { //El callback nos puede dar un error o un objeto -> user

		if (err) {
			res.status(500).send({ message : 'Error en la petición' })
		}//END if error
		else{
			if (!user) {
				res.status(404).send({ message : 'No existe usuario en base de datos LOGIN USER' })
			}//END comprobación si llego el objeto correctamente
			else{
				//Si exite el usuario comprobamos la contraseña
				bcrypt.compare(password, user.password, function(err, check) {
					// Si el check es correcto devolver los datos del usuario logeado
					if (check) {

						if (params.gethash) {
							//Aca me devolvera un token jvk
							res.status(200).send({
								token: jwt.createToken(user)
							})
						}//En caso de no volver el token por defecto else
						else{
							res.status(200).send({user})
						}//END else gethash

					}//End check
					else{
						res.status(404).send({ message : 'El usuario no ah podido logearse' })
					}//End else check
				})//END function comparación password callback

			}//
		}//END comprobación si exite o no usuario

	}); //ORM de mongoose, ademas el callback err-ok
}

/*=====  End of LOGIN USERS  ======*/

/*===================================
=            UPDATE USER            =
===================================*/

function updateUser(req, res) {
	
	var userId = req.params.id;
	var	update = req.body;
	delete update._id; // Remover el ID

	if (userId != req.user.sub) {
		return res.status(500).send({ message : 'No tienes permiso!' })
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {

		if (err) {
			return res.status(500).send({message : 'Error al actualizar el usuario en API'}),
			console.log(err+" Error en la petición")
		}//Devuelve error 
		else{

			if (!userUpdated) {
				return res.status(404).send({ message : 'No se logró la actualización del usuario' })
			}
			else{
				res.status(200).send({ user: userUpdated })
			}//ENd else userudated
		}
	})
}

/*=====  End of UPDATE USER  ======*/

/*===================================
=            IMAGES USER            =
===================================*/

function uploadImage(req, res) {
	var userId = req.params.id;
    var	file_name = 'no subido...';
	
	console.log(req.files.image+" url imagen");
	console.log(req.Files);
			if (req.files.image !== undefined) {
		    	var file_path = req.files.image.path;
				var file_ext = path.extname(file_path),
		    		file_name = path.basename(file_path);

		    	if (file_ext == '.png' || file_ext == '.jpg') {
		    		User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {

		    		if (!userUpdated) {
						res.status(404).send({ message : 'No se logró la actualización del usuario' })
					}
						else{
							res.status(200).send({image: file_name, user: userUpdated})
						}//ENd else userudated

		    		})
		    	}//END IF EXT
		    	else{
		    		res.status(200).send({ message : 'Extension no válida' })
		    	}//END EXTENSION
		    }//END IF
		    else{
		    	res.status(200).send({message : 'No ha subido ningúna imagenes...'})
		    }
    /*fn.existsSync()

    if (req.files) {
    	console.log(res.files.image.path + "Aca vengo");
    	var file_path = req.files.image.path,
    		file_split = file_path.split('\\'),
    		file_name = file_split[2];

    	var	ext_split = file_path.split('\.'),
    		file_ext = ext_split[1];

    		console.log(file_path + file_ext)

    	if (file_ext == 'png' || file_ext == 'jpg') {
    		User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {

    		if (!userUpdated) {
				res.status(404).send({ message : 'No se logró la actualización del usuario' })
			}
				else{
					res.status(200).send({ user: userUpdated})
				}//ENd else userudated

    		})
    	}
    	else{
    		res.status(200).send({ message : 'Extension no válida' })
    	}//END EXTENSION
    }//END ID REG.FILES
    else{
    	res.status(200).send({message : 'No ha subido ningúna imagen...'})
    }*/
}

/*=====  End of IMAGES USER  ======*/

/*===================================
=            RUTA IMAGEN            =
===================================*/

function getImageFile(req, res) {
	
	var imageFile = req.params.imageFile,
		path_image ='./uploads/users/'+imageFile;

	/*
	fs.exists(path_image, function(exists) {
		
		if (exists) {
			res.sendFile(path.resolve(path_image));
		}
		else{
			res.status(200).send({ message : 'No existe la imagen...' })
		}
	});	
	*/
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

/*=====  End of RUTA IMAGEN  ======*/


/* Exportamos los modulos para requerir en cualquier archivo */
module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
}

/*
	var email =  params.email;
	User_Register.findOne({email: email}, (err, user) => {
		if (err) {
			res.status(500).send({ message : 'Error en la petición Register' })
		}//END if error
		else{
			if (!user) {	
				es.status(200).send({ message : 'No Usuario existe logins' });
			/*s
				if(params.password) {
				//encriptar contraseña y guardar datos
					bcrypt.hash(params.password, null, null, function(err, hash) {
						
						user.password = hash;
						
						if ( user.name != null && user.surname != null && user.email != null) {
							//guarde el usuario
							user.save((err, userStored) => {
								if (err) {
									res.status(500).send({ message : 'Error al guardar el usuario' });
								}else{
									if (!userStored) {
										res.status(404).send({ message : 'No se ha registrado el usuario' });
									}else{
										res.status(200).send({user: userStored});
									}
								}
							});
						}//END condicionales de campos si existen
						else{
							res.status(200).send({message : 'Introduce todos los campos'});
						}//END mensaje por defecto de condicionales.
					});
				}//END consulta de si exite contraseña
				else{ 
					res.status(200).send({message : 'Introduce la contraseña'});
				}//END mensaje defecto de contraseña
				
			}//END comprobación si llego el objeto correctamente
			else{
				res.status(200).send({ message : 'Usuario ya existe login' });
			}
		}
	});	*/