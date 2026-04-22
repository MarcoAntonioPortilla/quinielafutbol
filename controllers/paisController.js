//Declaramos dependencias que necesitamos en este controlador
const path = require('path');

//Declaramos el objeto que exportaremos como respuesta
const controller = {};



//MÉTODOS
//Visualiza la pantalla de alta país
controller.visualizar_alta_pais = (req, res) => {
    res.render('alta_pais.ejs');
}


//Subir un archivo al servidor
controller.alta_pais = (req, res) => {
    if(!req.files){ 
        res.render('alta_pais.ejs', {
            error: "No ha seleccionado el ARCHIVO a subir."
        });
    }else{
        var vArchivo = req.files.archivo;

        const ext = path.extname(vArchivo.name); 
        const ext_permitidas = ['.png', '.jpg', '.jpeg', '.gif'];
    
        if(!ext_permitidas.includes(ext)){
            res.render('alta_pais.ejs', {
                error: "El formato del archivo es INCORRECTO. Los formatos permitidos son: '.png', '.jpg', '.jpeg', '.gif'."
            });
        }else{
            var ruta_archivo = "views/assets/img/" + vArchivo.name; 
    
            vArchivo.mv(ruta_archivo, (err) => {
                if(err){
                    res.render('alta_pais.ejs', {
                        error: "Ocurrió un ERROR al subir el archivo: " + err + "."
                    });
                }else{
                    const nombre = req.body.nombre;
                    const archivo = vArchivo.name;
            
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO pais (nombre, archivo) VALUES (?, ?)', [nombre, archivo], (err, pais) => {
                            res.render('alta_pais.ejs', {
                                alta: "Archivo CARGADO correctamente. Archivo: " + vArchivo.name + "."
                            });
                        });
                    });
                }
            });
        }
    }
}


//Visualizar todos los paises registrados
controller.visualizar_edicion_pais = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {
            process.env.MENSAJE = "";
            res.render('edicion_pais.ejs', {
                data: paises
            });
        });
    });
};


//Eliminar un pais
controller.eliminar_pais = (req, res) => {
    const id = req.params.idpais;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM pais WHERE idpais = ?', [id], (err, pais) => {
            process.env.MENSAJE = "Se ELIMINÓ correctamente el país.";
            res.redirect('/visualizar_paises2');
        });
    })
}


//Visualizar todos los países pero con un mensaje de eliminación de país
controller.visualizar_paises2 = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {
            res.render('edicion_pais.ejs', {
                data: paises
            });
        });
    });
};


//Obtenemos los datos de todos los países en la primer consulta y en la segunda los del país a actualizar 
//y los mostramos en el Modal
controller.actualizar_pais = (req, res) => {
    const id = req.params.idpais;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {

            conn.query('SELECT * FROM pais WHERE idpais = ?', [id], (err, pais_act) => {
                process.env.TIPO_USUARIO = "admin";
                process.env.MENSAJE = "";

                res.render('edicion_pais.ejs', {
                    data: paises,
                    pais_Mod: pais_act[0] 
                });
            });
        });
    });
}


//Actualiza la información de un país
controller.registrar_cambios_pais = (req, res) => {
    if(!req.files){ 
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {
                res.render('edicion_pais.ejs', {
                    data: paises,
                    error: "No ha seleccionado el ARCHIVO a subir."
                });
            });
        });
    }else{
        var vArchivo = req.files.archivo;

        const ext = path.extname(vArchivo.name); 
        const ext_permitidas = ['.png', '.jpg', '.jpeg', '.gif'];
    
        if(!ext_permitidas.includes(ext)){
            req.getConnection((err, conn) => {
                conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {
                    res.render('edicion_pais.ejs', {
                        data: paises,
                        error: "El formato del archivo es INCORRECTO. Los formatos permitidos son: '.png', '.jpg', '.jpeg', '.gif'."
                    });
                });
            });
        }else{
            var ruta_archivo = "views/assets/img/" + vArchivo.name; 
    
            vArchivo.mv(ruta_archivo, (err) => {
                if(err){
                    req.getConnection((err, conn) => {
                        conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {
                            res.render('edicion_pais.ejs', {
                                data: paises,
                                error: "Ocurrió un ERROR al subir el archivo: " + err + "."
                            });
                        });
                    });
                }else{
                    const id = req.params.idpais;
                    //const pais = req.body;
                    const nombre = req.body.nombre;
                    const archivo = vArchivo.name;
            
                    req.getConnection((err, conn) => {
                        conn.query('UPDATE pais SET nombre = ?, archivo = ? WHERE idpais = ?', [nombre, archivo, id], (err, rows) => {
                            conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {
                                process.env.MENSAJE = "Archivo CARGADO correctamente. Archivo: " + vArchivo.name + ".";
                                res.render('edicion_pais.ejs', {
                                    data: paises,
                                });
                            });    
                        });
                    });
                }
            });
        }
    }
}




//Exportamos el objeto
module.exports = controller;