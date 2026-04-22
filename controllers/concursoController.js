//Declaramos el archivo de seguridad.js que necesitamos para encriptar
const seguridad = require("../seguridad");

//Declaramos el objeto que exportaremos como respuesta
const controller = {};


//MÉTODOS
//Visualiza la pantalla de alta concurso y muestra los usuarios a asignarle el concurso
controller.visualizarConcurso = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario', (err, usuarios) => {
            for(let i = 0; i < usuarios.length; i++){
                usuarios[i].nombre = seguridad.desencriptado(usuarios[i].nombre);
            }
            
            process.env.CONCURSO = "";
            usuarios.reverse();

            res.render('alta_concurso.ejs', {
                usuarios: usuarios
            });
        });
    });        
}


//Dar de alta un concurso
controller.altaConcurso = (req, res) => {
    const nombre = req.body.nombre.trim();
    const usuarioAlta = req.body.usuario.trim();
    
    req.getConnection((err, conn) => {  
        conn.query('INSERT INTO concurso (concurso, idusuario) VALUES (?, ?)', [nombre, usuarioAlta], (err, usuario) => {    
            conn.query('SELECT * FROM usuario', (err, usuarios) => {
                for(let i = 0; i < usuarios.length; i++){
                    usuarios[i].nombre = seguridad.desencriptado(usuarios[i].nombre);
                }

                process.env.CONCURSO = nombre;
                usuarios.reverse();

                res.render('alta_concurso.ejs', {
                    alta: "Se le ha asignado el CONCURSO: "+ nombre + " al USUARIO seleccionado con Id: " + usuarioAlta,
                    usuarios: usuarios
                });
            });    
        });
    });
}; 


//Visualiza la pantalla de alta concurso y muestra los usuarios a asignarle el concurso
controller.editarConcurso = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario', (err, usuarios) => {
            for(let i = 0; i < usuarios.length; i++){
                usuarios[i].nombre = seguridad.desencriptado(usuarios[i].nombre);
            }
            
            process.env.CONCURSO_ANTERIOR = "";
            process.env.CONCURSO_NUEVO = "";

            usuarios.reverse();

            res.render('edicion_concurso.ejs', {
                usuarios: usuarios
            });
        });
    });        
}


//Dar de alta un concurso
controller.guardarEditarConcurso = (req, res) => {
    const usuarioAlta = req.body.usuario.trim();
    const nombreAnterior = req.body.nombreAnterior.trim();
    const nombre = req.body.nombre.trim();
    
    req.getConnection((err, conn) => {  
        conn.query('UPDATE concurso SET concurso = ? WHERE concurso = ? AND idusuario = ?', [nombre, nombreAnterior, usuarioAlta], (err, usuario) => {    
            conn.query('SELECT * FROM usuario', (err, usuarios) => {
                for(let i = 0; i < usuarios.length; i++){
                    usuarios[i].nombre = seguridad.desencriptado(usuarios[i].nombre);
                }

                process.env.CONCURSO_ANTERIOR = nombreAnterior;
                process.env.CONCURSO_NUEVO = nombre;

                usuarios.reverse();

                res.render('edicion_concurso.ejs', {
                    alta: "Se le ha asignado el CONCURSO: "+ nombre + " al USUARIO seleccionado con Id: " + usuarioAlta,
                    usuarios: usuarios
                });
            });    
        });
    });
}; 



//Exportamos el objeto
module.exports = controller;