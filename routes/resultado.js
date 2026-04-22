//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();

//Importamos el controlador
const resultadoController = require('../controllers/resultadoController');

//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');



//RUTAS
//Ruta que nos muestra la selección del evento para la captura de quiniela
router.get('/resultadoSelEvento', verificaToken, resultadoController.resultadoSelEvento);

//Filtrar los partidos pertenecientes al evento seleccionado para su captura
router.post('/mostrarPartidos', resultadoController.mostrarPartidos);

//Filtrar los partidos pertenecientes al evento seleccionado para su captura
router.post('/guardarResultados', resultadoController.guardarResultados);


//Exportamos el módulo
module.exports = router;
