////Declaramos la dependencia 
const jwt = require('jsonwebtoken');




//Función de verificación del token
let verificaToken = (req, res, next) => {
    let token = process.env.TOKEN;
    console.log('token de autenticacion.js: ' + token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            console.log('Error: Es necesario loguearse para accesar al sistema');
            res.render('login.ejs', {
                error: 'Error: Es necesario loguearse para accesar al sistema.'
            });
        }

        req.usuario = decoded.usuario;
        console.log(req.usuario);
        next();
    });
};




//Exportamos la función
module.exports = { verificaToken }