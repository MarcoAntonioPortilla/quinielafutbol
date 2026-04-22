//Puerto
process.env.PORT = process.env.PORT || 3000;

//Configuración BD
process.env.DB_HOST = process.env.DB_HOST || 'localhost'; 
process.env.DB_USERNAME = process.env.DB_USERNAME || 'root';
process.env.DB_PASSWORD =  process.env.DB_PASSWORD || 'admin';
process.env.DB_PORT = process.env.DB_PORT || 8000;
process.env.DATABASENAME = process.env.DATABASENAME || 'proyecto'; 

//Vencimiento del Token
process.env.CADUCIDAD_TOKEN = '2h';

//SEED de Autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'; 

//Intentos del usuario
process.env.INTENTOS = 0;

//Total de intentos fallidos de logueo permitidos
process.env.TOTAL_INTENTOS = 10;

//Especificamos 16 caracteres del Vector de Iniciación del archivo seguridad.js 
process.env.VI = 'caracter pass 16'; 

//Especificamos 32 caracteres de la clave del archivo seguridad.js
process.env.CLAVE = 'estos son 32 caracteres, esperof';

//Especificamos el algoritmo de encriptación
process.env.ALGORITMO = 'aes-256-cbc'; //aes-128-gcm