const bcrypt = require('bcrypt');
const crypto = require('crypto');



function hash(clave) {
    const ciclos = 10;
    const salt = bcrypt.genSaltSync(ciclos);

    const claveConHash = bcrypt.hashSync(clave, salt);

    return claveConHash;
}





const vi = process.env.VI;                 //crypto.randomBytes(16);  VI = Vector de Iniciación
const clave = process.env.CLAVE;           //crypto.randomBytes(32);
const algoritmo = process.env.ALGORITMO;



function encriptado(dato) {
    const cifrado = crypto.createCipheriv(algoritmo, clave, vi);

    let encriptado = cifrado.update(dato, 'utf8', 'hex');

    encriptado += cifrado.final('hex');

    return encriptado;
}



function desencriptado(encryptedData){
    const decifrado = crypto.createDecipheriv(algoritmo, clave, vi);

    let datosDesencriptados = decifrado.update(encryptedData, "hex", "utf-8");

    datosDesencriptados += decifrado.final("utf8");

    return datosDesencriptados;
}



//Exportamos las funciones
module.exports = {hash, encriptado, desencriptado};



