//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();


//Importamos el controlador
const partidoController = require('../controllers/partidoController');


//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');



//RUTAS
//Nos muestra la pantalla de captura del nuevo partido
router.get('/visualizar_captura_partido', verificaToken, partidoController.visualizar_captura_partido);

//Registramos un nuevo partido
router.post('/alta_nuevo_partido', verificaToken, partidoController.alta_nuevo_partido);

//Visualizamos los partidos capturados para editarlos o eliminarlos
router.get('/visualizar_edicion_partido', verificaToken, partidoController.visualizar_edicion_partido);

//Visualizamos los partidos según evento seleccionado
router.post('/mostrar_partidos', verificaToken, partidoController.mostrar_partidos);

//Eliminamos un partido
router.get('/eliminar_partido/:idpartido', verificaToken, partidoController.eliminar_partido);

//Obtenemos los datos del partido a actualizar y los mostramos en el Modal
router.get('/actualizar_partido/:idpartido', verificaToken, partidoController.actualizar_partido);

//Registrar los cambios al partido seleccionado
router.post('/registrar_cambios_partido/:idpartido', verificaToken, partidoController.registrar_cambios_partido);



//Exportamos el módulo
module.exports = router;