//Importando las dependencias
const express = require('express');
const app = express();



//Rutas de la aplicación
app.use(require('./login'));
app.use(require('./usuario'));
app.use(require('./evento'));
app.use(require('./pais'));
app.use(require('./partido'));
app.use(require('./quiniela'));
app.use(require('./resultado'));
app.use(require('./posicion'));
app.use(require('./resultadoParticipantes'));
app.use(require('./concurso'));
app.use(require('./resultadosOficiales'));



//Exportamos las rutas para utilizarlos en toda la aplicación
module.exports = app;