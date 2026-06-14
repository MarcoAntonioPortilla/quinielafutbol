//Declaramos el objeto que exportaremos como respuesta
const controller = {};



//MÉTODOS
//Realizamos las consultas necesarias para darle valores a los select de la pantalla de captura de partidos
controller.visualizar_captura_partido = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {
                res.render('captura_partido.ejs', {
                    eventos: eventos,
                    paises: paises,
                    dataSession: req.session
                });
            });    
        });
    })
}


//Registramos un nuevo partido
controller.alta_nuevo_partido = (req, res) => {
    const data = req.body;
    
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO partido SET ?', [data], (err, partido) => {
            conn.query('SELECT * FROM evento', (err, eventos) => {    
                conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {
                    conn.query('SELECT * FROM evento WHERE idevento = ?',[req.body.evento], (err, nombreEvento) => {
                        req.session.FECHA = req.body.fecha;
                        req.session.GRUPO = req.body.grupo;
                        
                        res.render('captura_partido.ejs', {
                            alta: "Se ha dada de ALTA correctamente el partido.",
                            eventoSel: req.body.evento,
                            nombreEvento: nombreEvento[0].nombre,
                            eventos: eventos,
                            paises: paises,
                            dataSession: req.session
                        });
                    });    
                });    
            });    
        });
    });
}


//Visualizar los eventos para posteriormente visualizar los partidos
controller.visualizar_edicion_partido = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            req.session.EVENTO_SEL_NOMBRE = "";
            
            res.render('edicion_partido.ejs', {
                eventos: eventos,
                dataSession: req.session
            });
        });    
    });    
}


//Mostar partidos según evento seleccionado
controller.mostrar_partidos = (req, res) => {
    const idevento = req.body.evento;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            conn.query('SELECT partido.*, subConsultapais.idpais AS pais1, subConsultapais.nombre AS nombre1, ' + 
                       'subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, subConsultapais2.nombre AS nombre2, ' + 
                       'subConsultapais2.archivo AS archivo2 ' +
                       'FROM partido, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, ' + 
                       '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                       'WHERE partido.equipo1 = subConsultapais.idpais AND partido.equipo2 = subConsultapais2.idpais ' +
                       'AND partido.evento = ? ORDER BY partido.fecha, partido.hora, partido.grupo', [idevento], (err, partidos) => {
                conn.query('SELECT * FROM evento WHERE idevento = ?',[idevento], (err, eventoSel) => {
                    req.session.EVENTO_SEL = idevento;
                    req.session.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                                        
                    res.render('edicion_partido.ejs', {
                        eventos: eventos,
                        data: partidos,
                        dataSession: req.session
                    });
                });    
            });    
        });    
    });    
}


//Eliminar un partido
controller.eliminar_partido = (req, res) => {
    const id = req.params.idpartido;
    //const idevento = req.params.idevento;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM partido WHERE idpartido = ?', [id], (err, partido) => {
            conn.query('SELECT * FROM evento', (err, eventos) => {
                conn.query('SELECT partido.*, subConsultapais.idpais AS pais1, subConsultapais.nombre AS nombre1, ' + 
                           'subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, subConsultapais2.nombre AS nombre2, ' + 
                           'subConsultapais2.archivo AS archivo2 ' +
                           'FROM partido, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, ' + 
                           '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                           'WHERE partido.equipo1 = subConsultapais.idpais AND partido.equipo2 = subConsultapais2.idpais ' +
                           'AND partido.evento = ? ORDER BY partido.grupo, partido.fecha', [req.session.EVENTO_SEL], (err, partidos) => {
            
                    res.render('edicion_partido.ejs', {
                        eventos: eventos,
                        data: partidos,
                        mensaje: 'Se ha ELIMINADO el partido seleccionado.',
                        dataSession: req.session 
                    });
                });
            });    
        });
    });        
}    


//Obtenemos los datos de todos los partidos en la primer consulta y en la segunda los del partido a actualizar 
//y los mostramos en el Modal
controller.actualizar_partido = (req, res) => {
    const id = req.params.idpartido;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            conn.query('SELECT partido.*, subConsultapais.idpais AS pais1, subConsultapais.nombre AS nombre1, ' + 
                       'subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, subConsultapais2.nombre AS nombre2, ' + 
                       'subConsultapais2.archivo AS archivo2 ' +
                       'FROM partido, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, ' + 
                       '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                       'WHERE partido.equipo1 = subConsultapais.idpais AND partido.equipo2 = subConsultapais2.idpais ' +
                       'AND partido.evento = ? ORDER BY partido.grupo, partido.fecha', [req.session.EVENTO_SEL], (err, partidos) => {
                conn.query('SELECT partido.*, subConsultapais.idpais AS pais1, subConsultapais.nombre AS nombre1, ' + 
                           'subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, subConsultapais2.nombre AS nombre2, ' + 
                           'subConsultapais2.archivo AS archivo2 ' +
                           'FROM partido, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, ' + 
                           '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                           'WHERE partido.equipo1 = subConsultapais.idpais AND partido.equipo2 = subConsultapais2.idpais ' +
                           'AND partido.evento = ? AND partido.idpartido = ?', [req.session.EVENTO_SEL, id], (err, partidoSel) => {
                    conn.query('SELECT * FROM pais ORDER BY nombre', (err, paises) => {        
                        req.session.MENSAJE = "";

                        res.render('edicion_partido.ejs', {
                            eventos: eventos,
                            data: partidos,
                            partidoSel: partidoSel[0],
                            paises: paises,
                            dataSession: req.session
                        });  
                    });    
                });        
            });
        });    
    });
}


//Registramos los cambios al partido
controller.registrar_cambios_partido = (req, res) => {
    const id = req.params.idpartido;
    
    const fechaString = req.body.fecha;
    const fechaArreglo = fechaString.split("/");
    const fecha = new Date(+fechaArreglo[2], fechaArreglo[1] - 1, +fechaArreglo[0]); 

    const grupo = req.body.grupo.toUpperCase();
    const equipo1 = req.body.equipo1;
    const equipo2 = req.body.equipo2;
    const hora = req.body.hora;
    
    req.getConnection((err, conn) => {
        conn.query('UPDATE partido SET fecha = ?, grupo = ?, equipo1 = ?, equipo2 = ?, hora = ? WHERE idpartido = ?', [fecha, grupo, equipo1, equipo2, hora, id], (err, rows) => {
            conn.query('SELECT * FROM evento', (err, eventos) => {
                conn.query('SELECT partido.*, subConsultapais.idpais AS pais1, subConsultapais.nombre AS nombre1, ' + 
                        'subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, subConsultapais2.nombre AS nombre2, ' + 
                        'subConsultapais2.archivo AS archivo2 ' +
                        'FROM partido, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, ' + 
                        '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                        'WHERE partido.equipo1 = subConsultapais.idpais AND partido.equipo2 = subConsultapais2.idpais ' +
                        'AND partido.evento = ? ORDER BY partido.grupo, partido.fecha', [req.session.EVENTO_SEL], (err, partidos) => {
                
                        res.render('edicion_partido.ejs', {
                            eventos: eventos,
                            data: partidos,
                            mensaje: 'Se ha ACTUALIZADO el partido seleccionado.',
                            dataSession: req.session
                        });
                });
            });    
        });        
    });    
}  



//Exportamos el objeto
module.exports = controller;