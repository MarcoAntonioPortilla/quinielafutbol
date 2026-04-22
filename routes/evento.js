//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();


//Importamos el controlador
const eventoController = require('../controllers/eventoController');


//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');




//RUTAS
//Nos muestra la pantalla de captura del nuevo evento
router.get('/alta_evento', verificaToken, eventoController.visualizar_evento);

//Da de alta un nuevo evento
router.post('/alta_Nuevo_Evento', verificaToken, eventoController.alta_Nuevo_Evento);

//Mostramos los eventos para posteriormente eliminar uno
router.get('/mostrar_evento', verificaToken, eventoController.mostrar_evento);

//Eliminamos uno de los eventos mostrados
router.get('/eliminar_evento/:idevento', verificaToken, eventoController.eliminar_evento);




//Exportamos el módulo
module.exports = router;