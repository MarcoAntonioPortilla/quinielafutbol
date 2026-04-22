//Declaramos los módulos a utilizar
const express = require('express');
const router = express.Router();


//Importamos el controlador
const concursoController = require('../controllers/concursoController');


//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');




//RUTAS
//Nos muestra la pantalla de captura del nuevo usuario
router.get('/visualizarConcurso', verificaToken, concursoController.visualizarConcurso);

//Se registra el nuevo concurso
router.post('/altaConcurso', verificaToken, concursoController.altaConcurso);

//Nos muestra la pantalla a los usuarios para actualizar el concurso
router.get('/editarConcurso', verificaToken, concursoController.editarConcurso);

//Se registra el nuevo concurso
router.post('/gardarEditarConcurso', verificaToken, concursoController.guardarEditarConcurso);



//Exportamos el módulo
module.exports = router;