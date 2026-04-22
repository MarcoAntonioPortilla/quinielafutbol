//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();


//Importamos el controlador
const loginController = require('../controllers/loginController');


//RUTAS
//Verifica si existe el usuario en la BD
router.post('/login', loginController.login);

//Ruta que nos regresa a la ventana de login
router.get('/inicio', loginController.inicio);



//Exportamos el módulo
module.exports = router;