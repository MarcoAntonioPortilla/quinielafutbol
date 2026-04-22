//Declaramos los módulos a utilizar
const express = require('express');

const router = express.Router();


//Importamos el controlador
const paisController = require('../controllers/paisController');


//Importamos el módulo de validación
const { verificaToken } = require('../autenticacion');




//RUTAS
//Nos muestra la pantalla de captura del nuevo usuario
router.get('/visualizar_alta_pais', verificaToken, paisController.visualizar_alta_pais);

//Sube archivo del país
router.post('/alta_pais', verificaToken, paisController.alta_pais);

//Vidualizar todos los países registrados
router.get('/visualizar_edicion_pais', verificaToken, paisController.visualizar_edicion_pais);

//Elimina un país
router.get('/eliminar_pais/:idpais', verificaToken, paisController.eliminar_pais);

//Nos muestra a todos los países registrados pero con un mensaje de eliminación de país
router.get('/visualizar_paises2', verificaToken, paisController.visualizar_paises2);

//Obtenemos los datos del pais a actualizar y los mostramos en el Modal
router.get('/actualizar_pais/:idpais', verificaToken, paisController.actualizar_pais);

//Registrar los cambios al país seleccionado
router.post('/registrar_cambios_pais/:idpais', verificaToken, paisController.registrar_cambios_pais);



//Exportamos el módulo
module.exports = router;