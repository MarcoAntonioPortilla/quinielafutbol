//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();

//Importamos el controlador
const resultadosOficialesController = require('../controllers/resultadosOficialesController');

//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');



//RUTAS
//Ruta que nos muestra la selección del evento para ver la tabla de posiciones
router.get('/selEventoOficial', verificaToken, resultadosOficialesController.selEventoOficial);

//Ruta que nos muestra la tabla de posiciones en base a un evento proporcionado
router.post('/verResultadosOficiales', verificaToken, resultadosOficialesController.verResultadosOficiales);



//Exportamos el módulo
module.exports = router;