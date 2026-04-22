//Declaramos el objeto que exportaremos como respuesta
const controller = {};


//Consultas SQL recurrentes
const SQL_verPartidos = 'SELECT partido.*, quin.idevento AS quinevento, quin.idpartido AS quinpartido, quin.idusuario AS quinusuario, ' +
                            'quin.equipo1 AS quinequipo1, quin.equipo2 AS quinequipo2, subConsultapais.idpais AS pais1, ' +
                            'subConsultapais.nombre AS nombre1, subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, ' +
                            'subConsultapais2.nombre AS nombre2, subConsultapais2.archivo AS archivo2 ' +
                        'FROM partido LEFT JOIN quin ON partido.idpartido = quin.idpartido AND quin.idusuario = ? AND quin.concurso = ?, ' +
                            '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                        'WHERE partido.fecha >= CURDATE() AND partido.equipo1 = subConsultapais.idpais AND partido.equipo2 = subConsultapais2.idpais AND partido.evento = ? ' + 
                        'ORDER BY partido.fecha, partido.grupo';


const SQL_verPartidosTotal = 'SELECT partido.*, quin.idevento AS quinevento, quin.idpartido AS quinpartido, quin.idusuario AS quinusuario, ' +
                                'quin.equipo1 AS quinequipo1, quin.equipo2 AS quinequipo2, subConsultapais.idpais AS pais1, ' +
                                'subConsultapais.nombre AS nombre1, subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, ' +
                                'subConsultapais2.nombre AS nombre2, subConsultapais2.archivo AS archivo2 ' +
                             'FROM partido LEFT JOIN quin ON partido.idpartido = quin.idpartido AND quin.idusuario = ? AND quin.concurso = ?, ' +
                                '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                             'WHERE partido.equipo1 = subConsultapais.idpais AND partido.equipo2 = subConsultapais2.idpais AND partido.evento = ? ' + 
                             'ORDER BY partido.fecha, partido.grupo';                        



//MÉTODOS
//*************************************************************Quiniela.ejs*********************************************************************

//Visualizamos en un select para que el usuario seleccione el evento de la quiniela con solo los partidos activos
controller.seleccionarEvento = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            process.env.EVENTO_SEL_NOMBRE = "";

            res.render('quiniela.ejs', {
                eventos: eventos,
            });
        });
    })
}


//Mostramos los partidos seleccionados según el evento para su captura
controller.mostrarQuiniela = (req, res) => {
    const idevento = req.body.evento;
    const usuario = parseInt(process.env.ID_USUARIO);
    const concurso = process.env.CLAVE_CONCURSO;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            conn.query(SQL_verPartidos, [usuario, concurso, idevento], (err, partidos) => {
                conn.query('SELECT * FROM evento WHERE idevento = ?',[idevento], (err, eventoSel) => {
                    process.env.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                    
                    //if(partidos.length > 0){
                    if(partidos && partidos.length > 0){
                    //if(partidos){    
                        res.render('quiniela.ejs', {
                            eventos: eventos,
                            data: partidos
                        });
                    }else{
                        res.render('quiniela.ejs', {
                            eventos: eventos,
                        });
                    }
                });    
            }); 
        });
    })
}


//Guardamos los resultados capturados por el usuario y mostramos de nueva cuenta los partidos y sus resultados asignados
controller.guardarQuiniela = (req, res) => {
    const evento = req.body.evento;
    const idusuario = parseInt(process.env.ID_USUARIO);
    const concurso = process.env.CLAVE_CONCURSO;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM partido WHERE evento = ?',[evento], (err, partidosEvento) => {
            for(let i = 0; i < partidosEvento.length; i++){
                let partido = "P_" + partidosEvento[i].idpartido;
                let input1 = "Eq_1_" + partidosEvento[i].idpartido;
                let input2 = "Eq_2_" + partidosEvento[i].idpartido;
                let FechaPartido = "FechaPartido_" + partidosEvento[i].idpartido;
                
                let partidoFinal = req.body[partido];
                let marcador1 = req.body[input1];
                let marcador2 = req.body[input2];
                let FPartido = new Date(req.body[FechaPartido]);

                let fechaActual = new Date();
                let fechaActual2 = fechaActual.toLocaleString("en-US", {timeZone: 'America/Mexico_City'});
                let fechaActual3 = new Date(fechaActual2);

                console.log("idUsuario: " + idusuario);
                console.log("partidoFinal: " + partidoFinal);
                console.log("marcador 1: " + marcador1);
                console.log("marcador 2: " + marcador2);

                if(fechaActual3 < FPartido){
                    conn.query('SELECT * FROM quin WHERE idpartido = ? AND idusuario = ? AND concurso = ?',[partidoFinal, idusuario, concurso], (err, partidoEspecifico) => {
                        if(partidoEspecifico.length > 0){
                            conn.query('UPDATE quin SET equipo1 = ?, equipo2 = ? WHERE idquin = ?',[marcador1, marcador2, partidoEspecifico[0].idquin], (err, registroPartido) => {
                            });    
                        }else{
                            conn.query('INSERT INTO quin(idevento, idpartido, idusuario, equipo1, equipo2, concurso) VALUES (?, ?, ?, ?, ?, ?)',[evento, partidoFinal, idusuario, marcador1, marcador2, concurso], (err, registroPartido) => {
                            });  
                        }
                    });
                }    
            }

            conn.query('SELECT * FROM evento', (err, eventos) => {
                conn.query(SQL_verPartidos, [idusuario, concurso, evento], (err, partidos) => {
                    conn.query('SELECT * FROM evento WHERE idevento = ?',[evento], (err, eventoSel) => {
                        process.env.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                                            
                        res.render('quiniela.ejs', {
                            mensaje: "Se han REGISTRADO los marcadores capturados.",
                            eventos: eventos,
                            data: partidos
                        });
                    });    
                }); 
            });
        });
    });        
}






//*************************************************************QuinielaTotal.ejs*********************************************************************

//Visualizamos en un select para que el usuario seleccione el evento de la quiniela con todos los partidos activos y concluidos
controller.seleccionarEventoTotal = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            process.env.EVENTO_SEL_NOMBRE = "";

            res.render('quiniela_total.ejs', {
                eventos: eventos,
            });
        });
    })
}


//Mostramos los partidos seleccionados según el evento para su captura
controller.mostrarQuinielaTotal = (req, res) => {
    const idevento = req.body.evento;
    const usuario = parseInt(process.env.ID_USUARIO);
    const concurso = process.env.CLAVE_CONCURSO;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            conn.query(SQL_verPartidosTotal, [usuario, concurso, idevento], (err, partidos) => {
                conn.query('SELECT * FROM evento WHERE idevento = ?',[idevento], (err, eventoSel) => {
                    process.env.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                                
                    if(partidos.length > 0){
                        res.render('quiniela_total.ejs', {
                            eventos: eventos,
                            data: partidos
                        });
                    }else{
                        res.render('quiniela_total.ejs', {
                            eventos: eventos,
                        });
                    }
                });    
            }); 
        });
    })
}


//Guardamos los resultados capturados por el usuario y mostramos de nueva cuenta los partidos y sus resultados asignados
controller.guardarQuinielaTotal = (req, res) => {
    const evento = req.body.evento;
    const idusuario = parseInt(process.env.ID_USUARIO);
    const concurso = process.env.CLAVE_CONCURSO;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM partido WHERE evento = ?',[evento], (err, partidosEvento) => {
            for(let i = 0; i < partidosEvento.length; i++){
                let partido = "P_" + partidosEvento[i].idpartido;
                let input1 = "Eq_1_" + partidosEvento[i].idpartido;
                let input2 = "Eq_2_" + partidosEvento[i].idpartido;
                let FechaPartido = "FechaPartido_" + partidosEvento[i].idpartido;
                
                let partidoFinal = req.body[partido];
                let marcador1 = req.body[input1];
                let marcador2 = req.body[input2];
                let FPartido = new Date(req.body[FechaPartido]);

                let fechaActual = new Date();
                let fechaActual2 = fechaActual.toLocaleString("en-US", {timeZone: 'America/Mexico_City'});
                let fechaActual3 = new Date(fechaActual2);

                console.log("idUsuario: " + idusuario);
                console.log("partidoFinal: " + partidoFinal);
                console.log("marcador 1: " + marcador1);
                console.log("marcador 2: " + marcador2);

                if(fechaActual3 < FPartido){
                    conn.query('SELECT * FROM quin WHERE idpartido = ? AND idusuario = ? AND concurso = ?',[partidoFinal, idusuario, concurso], (err, partidoEspecifico) => {
                        if(partidoEspecifico.length > 0){
                            conn.query('UPDATE quin SET equipo1 = ?, equipo2 = ? WHERE idquin = ?',[marcador1, marcador2, partidoEspecifico[0].idquin], (err, registroPartido) => {
                            });    
                        }else{
                            conn.query('INSERT INTO quin(idevento, idpartido, idusuario, equipo1, equipo2, concurso) VALUES (?, ?, ?, ?, ?, ?)',[evento, partidoFinal, idusuario, marcador1, marcador2, concurso], (err, registroPartido) => {
                            });  
                        }
                    });
                }    
            }

            conn.query('SELECT * FROM evento', (err, eventos) => {
                conn.query(SQL_verPartidosTotal, [idusuario, concurso, evento], (err, partidos) => {
                    conn.query('SELECT * FROM evento WHERE idevento = ?',[evento], (err, eventoSel) => {
                        process.env.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                                            
                        res.render('quiniela.ejs', {
                            mensaje: "Se han REGISTRADO los marcadores capturados.",
                            eventos: eventos,
                            data: partidos
                        });
                    });    
                }); 
            });
        });
    });        
}





//Exportamos el objeto
module.exports = controller;