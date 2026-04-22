//Declaramos el archivo de seguridad.js que necesitamos para encriptar
const seguridad = require("../seguridad");

//Declaramos el objeto que exportaremos como respuesta
const controller = {};


//MÉTODOS
//Visualiza la pantalla de alta usuario
controller.visualizar_alta_usuario = (req, res) => {
    res.render('alta_usuario.ejs');
}


//Dar de alta un usuario en la tabla usuario
controller.alta_usuario = (req, res) => {
    const nombre = seguridad.encriptado(req.body.nombre.trim());
    const password = seguridad.encriptado(req.body.password.trim());
    const tipo = seguridad.encriptado(req.body.tipo.trim());

    req.getConnection((err, conn) => {  
        conn.query('SELECT * FROM usuario WHERE nombre = ?',[nombre], (err, usuarios) => {
            if(usuarios.length > 0){
                res.render('alta_usuario.ejs', {
                    error: "Ya está REGISTRADA la cuenta: " + req.body.nombre
                });        
            }else{
                conn.query('INSERT INTO usuario (nombre, password, tipo) VALUES (?, ?, ?)', [nombre, password, tipo], (err, usuario) => {    
                    res.render('alta_usuario.ejs', {
                        alta: "Se ha dada de ALTA correctamente el usuario: " + req.body.nombre
                    });
                });
            }
        });    
    });
}; 


//Visualizar todos los usuarios
controller.visualizar_usuarios = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario', (err, usuarios) => {
            if(usuarios.length > 0){
                for(let i=0; i < usuarios.length; i++){
                    usuarios[i].nombre = seguridad.desencriptado(usuarios[i].nombre);
                    usuarios[i].password = seguridad.desencriptado(usuarios[i].password);
                    usuarios[i].tipo = seguridad.desencriptado(usuarios[i].tipo);
                }
            }
            process.env.MENSAJE = "";
            res.render('edicion_usuario.ejs', {
                data: usuarios
            });
        });
    });
};


//Eliminar un usuario
controller.eliminar_usuario = (req, res) => {
    const id = req.params.idusuario;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM usuario WHERE idusuario = ?', [id], (err, usuario) => {
            process.env.MENSAJE = "Se ELIMINÓ correctamente el usuario";
            res.redirect('/visualizar_usuarios2');
        });
    })
}


//Visualizar todos los usuarios pero con un mensaje de eliminación de usuario
controller.visualizar_usuarios2 = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario', (err, usuarios) => {
            if(usuarios.length > 0){
                for(let i=0; i < usuarios.length; i++){
                    usuarios[i].nombre = seguridad.desencriptado(usuarios[i].nombre);
                    usuarios[i].password = seguridad.desencriptado(usuarios[i].password);
                    usuarios[i].tipo = seguridad.desencriptado(usuarios[i].tipo);
                }
            }
            res.render('edicion_usuario.ejs', {
                data: usuarios
            });
        });
    });
};


//Obtenemos los datos de todos los usuarios en la primer consulta y en la segunda los del usuario a actualizar 
//y los mostramos en el Modal
controller.actualizar_usuario = (req, res) => {
    const id = req.params.idusuario;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario', (err, usuarios) => {
            if(usuarios.length > 0){
                for(let i=0; i < usuarios.length; i++){
                    usuarios[i].nombre = seguridad.desencriptado(usuarios[i].nombre);
                    usuarios[i].password = seguridad.desencriptado(usuarios[i].password);
                    usuarios[i].tipo = seguridad.desencriptado(usuarios[i].tipo);
                }
            }
            conn.query('SELECT * FROM usuario WHERE idusuario = ?', [id], (err, usuario_act) => {
                usuario_act[0].nombre = seguridad.desencriptado(usuario_act[0].nombre);
                usuario_act[0].password = seguridad.desencriptado(usuario_act[0].password);
                usuario_act[0].tipo = seguridad.desencriptado(usuario_act[0].tipo);
                                
                process.env.TIPO_USUARIO = "admin";
                process.env.MENSAJE = "";

                res.render('edicion_usuario.ejs', {
                    data: usuarios,
                    usuario_Mod: usuario_act[0] 
                });
            });
        });
    });
}


//Actualiza la información de un usuario
controller.registrar_cambios = (req, res) => {
    const id = req.params.idusuario;
    
    const nombre = seguridad.encriptado(req.body.nombre.trim());
    const password = seguridad.encriptado(req.body.password.trim());
    const tipo = seguridad.encriptado(req.body.tipo.trim());
    
    req.getConnection((err, conn) => {  
        conn.query('UPDATE usuario SET nombre = ?, password = ?, tipo = ? WHERE idusuario = ?', [nombre, password, tipo, id], (err, rows) => {        

            conn.query('SELECT * FROM usuario', (err, usuarios) => {
                if(usuarios.length > 0){
                    for(let i=0; i < usuarios.length; i++){
                        usuarios[i].nombre = seguridad.desencriptado(usuarios[i].nombre);
                        usuarios[i].password = seguridad.desencriptado(usuarios[i].password);
                        usuarios[i].tipo = seguridad.desencriptado(usuarios[i].tipo);
                    }
                }
                
                process.env.MENSAJE = "Se ha ACTUALIZADO la información del usuario: " + req.body.nombre;
        
                res.render('edicion_usuario.ejs', {
                    data: usuarios
                });
            });    
        });
    })
}


//Visualizar la información de una cuenta de usuario para un cambio de contraseña
controller.cambio_contrasena = (req, res) => {
    const nombreUsuario = seguridad.encriptado(req.params.nombreUsuario.trim());

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE nombre = ?', [nombreUsuario], (err, usuario_act) => {
            usuario_act[0].nombre = seguridad.desencriptado(usuario_act[0].nombre);
            
            res.render('cambio_contrasena.ejs', {
                data: usuario_act[0]
            });
        });    
    });    
}


//Actualizamos la información de la cuenta de usuario en la BD
controller.actualizar_contrasena = (req, res) => {
    const id = req.params.idusuario;

    const nombre = req.body.nombre.trim();
    const passwordAnt = req.body.passwordAnterior.trim();
    const password1 = req.body.passwordNuevo1.trim();
    const password2 = req.body.passwordNuevo2.trim();

    var usuarioRegex = /^[A-Za-z][A-Za-z0-9!.@#$%^&*]{8,}$/;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuario WHERE password = ?', [seguridad.encriptado(passwordAnt)], (err, usuarioAnt) => {
            
            if(usuarioAnt.length === 0){
                conn.query('SELECT * FROM usuario WHERE idusuario = ?', [id], (err, usuario_act) => {
                    usuario_act[0].nombre = seguridad.desencriptado(usuario_act[0].nombre);

                    res.render('cambio_contrasena.ejs', {
                        data: usuario_act[0],
                        error: 'Contraseña anterior INCORRECTA.'
                    });
                }); 
            }else if(password1 !== password2){
                conn.query('SELECT * FROM usuario WHERE idusuario = ?', [id], (err, usuario_act) => {
                    usuario_act[0].nombre = seguridad.desencriptado(usuario_act[0].nombre);

                    res.render('cambio_contrasena.ejs', {
                        data: usuario_act[0],
                        error: 'Contraseñas nuevas NO COINCIDEN.'
                    });
                }); 
            }else if(!nombre.match(usuarioRegex) || !password1.match(usuarioRegex)){
                conn.query('SELECT * FROM usuario WHERE idusuario = ?', [id], (err, usuario_act) => {
                    usuario_act[0].nombre = seguridad.desencriptado(usuario_act[0].nombre);

                    res.render('cambio_contrasena.ejs', {
                        data: usuario_act[0],
                        error: 'El USUARIO o la CONTRASEÑA no tienen el formato permitido. Se pueden ocupar mayúsculas, minúsculas, mínimo 8 caracteres y caracteres especiales: !.@#$%^&*'
                    });
                }); 
            }else{
                req.getConnection((err, conn) => {
                    conn.query('UPDATE usuario SET nombre = ?, password = ? WHERE idusuario = ?', [seguridad.encriptado(nombre), seguridad.encriptado(password1), id], (err, usuario_act) => {
                        conn.query('SELECT * FROM usuario WHERE idusuario = ?', [id], (err, usuario) => {
                            usuario[0].nombre = seguridad.desencriptado(usuario[0].nombre);
                            process.env.NOMBRE_USUARIO = nombre;
                            
                            res.render('cambio_contrasena.ejs', {
                                data: usuario[0],
                                mensaje: 'Se han MODIFICADO de manera correcta los datos del usuario.'
                            });
                        });
                    });        
                });
            }
        });
    });    
}




//Exportamos el objeto
module.exports = controller;


