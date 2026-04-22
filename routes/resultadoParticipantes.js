//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();

//Importamos el controlador
const resultadoParticipantesController = require('../controllers/resultadoParticipantesController');

//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');



//RUTAS
//Ruta que nos muestra la selección del evento para ver la tabla de posiciones
router.get('/selEvento', verificaToken, resultadoParticipantesController.selEvento);

//Ruta que nos muestra la tabla de posiciones en base a un evento proporcionado
router.post('/verResultados', verificaToken, resultadoParticipantesController.verResultados);



//Exportamos el módulo
module.exports = router;