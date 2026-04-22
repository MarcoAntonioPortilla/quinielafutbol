//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();


//Importamos el controlador
const usuarioController = require('../controllers/usuarioController');


//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');




//RUTAS
//Nos muestra la pantalla de captura del nuevo usuario
router.get('/visualizar_alta_usuario', verificaToken, usuarioController.visualizar_alta_usuario);

//Ruta que da de alta un usuario en la tabla usuario
router.post('/alta_usuario', verificaToken, usuarioController.alta_usuario);

//Nos muestra a todos los usuarios registrados
router.get('/visualizar_usuarios', verificaToken, usuarioController.visualizar_usuarios);

//Elimina un usuario 
router.get('/eliminar_usuario/:idusuario', verificaToken, usuarioController.eliminar_usuario);

//Nos muestra a todos los usuarios registrados pero con un mensaje de eliminación de usuario
router.get('/visualizar_usuarios2', verificaToken, usuarioController.visualizar_usuarios2);

//Obtenemos los datos del usuario a actualizar y los mostramos en el Modal
router.get('/actualizar_usuario/:idusuario', verificaToken, usuarioController.actualizar_usuario);

//Registrar los cambios al usuario seleccionado
router.post('/registrar_cambios/:idusuario', verificaToken, usuarioController.registrar_cambios);

//Visualzamos la información de una cuenta de usuario en pantalla para edición
router.get('/cambio_contrasena/:nombreUsuario', verificaToken, usuarioController.cambio_contrasena);

//Actualizamos los datos de la cuenta del usuario en la BD
router.post('/actualizar_contrasena/:idusuario', verificaToken, usuarioController.actualizar_contrasena);


//Exportamos el módulo
module.exports = router;