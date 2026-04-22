//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();

//Importamos el controlador
const posicionController = require('../controllers/posicionController');

//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');



//RUTAS
//Ruta que nos muestra la selección del evento para ver la tabla de posiciones
router.get('/posiciones', verificaToken, posicionController.posiciones);

//Ruta que nos muestra la tabla de posiciones en base a un evento proporcionado
router.post('/verPosiciones', verificaToken, posicionController.verPosiciones);



//Exportamos el módulo
module.exports = router;