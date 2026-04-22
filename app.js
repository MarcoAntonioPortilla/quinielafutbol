//Importando las dependencias
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myconnection = require('express-myconnection');
const fileUpload = require("express-fileupload");

const app = express();


//Integramos el archivo config con las variables de entorno
require('./config');


//Especificamos el motor que utilizaremos para las vistas 'ejs'
app.set('view engine', 'ejs');


//Especificamos la carpeta en donde estarán nuestras vistas
//app.set('views', path.join(__dirname, 'views'));  // la línea de abajo reemplaza esta


//Habilitar la carpeta public : views. Permite que node sepa de donde obtener el Bootstrap, la carpeta de imágenes y la carpeta de las vistas
app.use(express.static(path.join(__dirname, './views'))); 


//Habilitamos el módulo que permite subir archivos
app.use(fileUpload());


//Configurando Morgan para mensajes en consola
app.use(morgan('dev'));


//Configurando la conexión a la BD
app.use(myconnection(mysql, {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DATABASENAME
}));


//Configuramos la utilización de variables java entre controladores y vistas
app.use(express.urlencoded({extended: false}));


//Indicamos la página de inicio
app.get('/', (request, response) => {
    response.render('login.ejs');
});


//Indicamos dónde están las rutas del sistema. Siempre deben de ser declaradas despues de la configuración de la BD.
app.use(require('./routes/index'));


//Inicializando el servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor ejecutándose en el puerto: ' + process.env.PORT);
})
