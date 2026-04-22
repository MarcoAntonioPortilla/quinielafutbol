//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();

//Importamos el controlador
const quinielaController = require('../controllers/quinielaController');

//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');



//RUTAS
//***************************************quiniela.ejs***********************************************************************
//Ruta que nos muestra la selección del evento para la captura de quiniela
router.get('/quinielaSelEvento', verificaToken, quinielaController.seleccionarEvento);

//Filtrar los partidos pertenecientes al evento seleccionado para su captura
router.post('/mostrar_quiniela', quinielaController.mostrarQuiniela);

//Registrar los resultados de la quiniela
router.post('/guardar_quiniela', quinielaController.guardarQuiniela);



//***************************************quiniela_total.ejs*****************************************************************
//Ruta que nos muestra la selección del evento para la captura de quiniela del total de los partidos capturados
router.get('/quinielaSelEventoTotal', verificaToken, quinielaController.seleccionarEventoTotal);

//Filtrar los partidos tanto vigentes como concluidos pertenecientes al evento seleccionado para su captura
router.post('/mostrar_quinielaTotal', quinielaController.mostrarQuinielaTotal);

//Registrar los resultados de la quiniela
router.post('/guardar_quinielaTotal', quinielaController.guardarQuinielaTotal);





//Exportamos el módulo
module.exports = router;