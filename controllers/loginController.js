//Declaramos las dependencias que necesitamos 
const jwt = require('jsonwebtoken');
const seguridad = require("../seguridad");

//Declaramos el objeto que exportaremos como respuesta
const controller = {};


//MÉTODOS
//Regresa a la ventana de login
controller.inicio = (req, res) => {
    process.env.TOKEN = "";
    
    res.render('login.ejs');
};


//Verificamos en la BD si existe el usuario
controller.login = (req, res) => {
    const usuario = req.body.login.trim();
    const password = req.body.loginPassword.trim();
    const concurso = req.body.concurso.trim();

    //var regex = /^[a-zA-Z0-9]+$/;
    var usuarioRegex = /^[A-Za-z][A-Za-z0-9!.@#$%^&*]{8,}$/;
    //var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    var contador = parseInt(process.env.INTENTOS);

    if(contador < process.env.TOTAL_INTENTOS){
        if(!usuario || !password || !concurso){
            console.log("Intentos fallidos realizados: " + process.env.INTENTOS);
            contador += 1;
            process.env.INTENTOS = contador;
                        
            res.render('login.ejs', {
                error: "USUARIO, CONTRASEÑA o CONCURSO vacíos. Intento [" +  process.env.INTENTOS + "/" + process.env.TOTAL_INTENTOS + "]"
            });

        }else if(!usuario.match(usuarioRegex) || !password.match(usuarioRegex)){
            console.log("Intentos fallidos realizados: " + process.env.INTENTOS);
            contador += 1;
            process.env.INTENTOS = contador;
                        
            res.render('login.ejs', {
                error: "Ha utilizado CARACTERES ESPECIALES NO PERMITIDOS o una cuenta o contraseña MENOR a 8 caracteres. Intento [" +  process.env.INTENTOS + "/" + process.env.TOTAL_INTENTOS + "]."
            });

        }else{
            const usuarioEnc = seguridad.encriptado(usuario); 
            const passwordEnc = seguridad.encriptado(password);
            
            /*const usuarioEnc = usuario; 
            const passwordEnc = password;*/

            req.getConnection((err, conn) => {
                conn.query('SELECT * ' + 
                           'FROM usuario, concurso ' +
                           'WHERE usuario.nombre = ? AND usuario.password = ? AND usuario.idusuario = concurso.idusuario ' + 
                           'AND concurso.concurso = ?', [usuarioEnc, passwordEnc, concurso], (err, usuario) => {
                    
                    if(usuario.length > 0){
                        console.log('Éxito en la consulta a la BD');

                        if(seguridad.desencriptado(usuario[0].tipo) === "bloqueado"){
                        //if(usuario[0].tipo === "bloqueado"){    
                            res.render('login.ejs', {
                                error: "Su USUARIO está BLOQUEADO. Favor de ponerse en contacto con el administrador del sistema."
                            });
                        }else{

                            let token = jwt.sign({usuario: usuario}, 
                                process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                            console.log('Éntramod al jwt');
                            console.log('Éxito: Ingresando a sistema');
                                                
                            process.env.TOKEN = token;
                                            
                            console.log('token de login.js: ' + token);
                        
                            process.env.TIPO_USUARIO = seguridad.desencriptado(usuario[0].tipo);
                            process.env.NOMBRE_USUARIO = seguridad.desencriptado(usuario[0].nombre);
                            process.env.ID_USUARIO = usuario[0].idusuario;
                            process.env.CLAVE_CONCURSO = usuario[0].concurso;
                                            

                            /*process.env.TIPO_USUARIO = usuario[0].tipo;
                            process.env.NOMBRE_USUARIO = usuario[0].nombre;
                            process.env.ID_USUARIO = usuario[0].idusuario;
                            process.env.CLAVE_CONCURSO = usuario[0].concurso;*/

                            res.render('inicio.ejs', {
                                data: usuario[0],
                                token: token
                            });
                        }
                    }else{
                        contador += 1;
                        process.env.INTENTOS = contador;
                                        
                        res.render('login.ejs', {
                            error: "USUARIO, CONTRASEÑA o CONCURSO incorrectos. Intento [" +  process.env.INTENTOS + "/" + process.env.TOTAL_INTENTOS + "]."
                        });
                    }
                });
            });    
        }


    }else{
        const tipo = seguridad.encriptado('bloqueado');
        const nombreUsu = seguridad.encriptado(usuario);

        req.getConnection((err, conn) => {
            conn.query('UPDATE usuario SET tipo = ? WHERE nombre = ?', [tipo, nombreUsu], (err, rows) => {
                res.render('login.ejs', {
                    error: "Ha sobrepasado el número de intentos permitidos (5). La cuenta ha sido BLOQUEADA y el equipo se ha INHABILITADO por 2 horas. Favor de ponerse en contacto con el administrador del sistema."
                });
            });    
        });    
    }    
};







//Exportamos el objeto
module.exports = controller;