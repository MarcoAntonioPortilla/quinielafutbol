//Declaramos el objeto que exportaremos como respuesta
const controller = {};




//MÉTODOS
//Visualizamos en un select para que el usuario seleccione el evento de los resultados a registrar 
controller.resultadoSelEvento = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            res.render('resultado.ejs', {
                eventos: eventos,
            });
        });
    })
}


//Mostramos los partidos seleccionados según el evento para su captura
controller.mostrarPartidos = (req, res) => {
    const idevento = req.body.evento;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            conn.query('SELECT partido.*, resultado.idevento AS resevento, resultado.idpartido AS respartido, resultado.equipo1 AS resequipo1, ' + 
                       'resultado.equipo2 AS resequipo2, subConsultapais.idpais AS pais1, subConsultapais.nombre AS nombre1, ' + 
                       'subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, subConsultapais2.nombre AS nombre2, ' + 
                       'subConsultapais2.archivo AS archivo2 ' +
                       'FROM partido LEFT JOIN resultado ON partido.idpartido = resultado.idpartido, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, ' + 
                       '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                       'WHERE partido.equipo1 = subConsultapais.idpais AND partido.equipo2 = subConsultapais2.idpais AND partido.evento = ? ' + 
                       'ORDER BY partido.grupo, partido.fecha', [idevento], (err, partidos) => {
                conn.query('SELECT * FROM evento WHERE idevento = ?',[idevento], (err, eventoSel) => {
                    process.env.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                                        
                    res.render('resultado.ejs', {
                        eventos: eventos,
                        data: partidos
                    });
                });    
            }); 
        });
    })
}


//Guardamos los resultados capturados por el usuario administrador y mostramos de nueva cuenta los partidos y sus resultados asignados
controller.guardarResultados = (req, res) => {
    const evento = req.body.evento;
    //const idusuario = parseInt(process.env.ID_USUARIO);
    let partido = "";
    let input1 = "";
    let input2 = "";
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM partido WHERE evento = ?',[evento], (err, partidosEvento) => {
            for(let i = 0; i < partidosEvento.length; i++){
                partido = "P_" + partidosEvento[i].idpartido;
                input1 = "Eq_1_" + partidosEvento[i].idpartido;
                input2 = "Eq_2_" + partidosEvento[i].idpartido;
                
                let partidoFinal = req.body[partido];
                let marcador1 = req.body[input1];
                let marcador2 = req.body[input2];

                console.log("evento: " + evento);
                console.log("partidoFinal: " + partidoFinal);
                console.log("marcador 1: " + marcador1);
                console.log("marcador 2: " + marcador2);
                
                conn.query('SELECT * FROM resultado WHERE idpartido = ?',[partidoFinal], (err, partidoEspecifico) => {
                    if(partidoEspecifico && partidoEspecifico.length > 0){
                        conn.query('UPDATE resultado SET equipo1 = ?, equipo2 = ? WHERE idresultado = ?',[marcador1, marcador2, partidoEspecifico[0].idresultado], (err, registroPartido) => {
                        });    
                    }else{
                        conn.query('INSERT INTO resultado(idevento, idpartido, equipo1, equipo2) VALUES (?, ?, ?, ?)',[evento, partidoFinal, marcador1, marcador2], (err, registroPartido) => {
                        });  
                    }
                });    
            }

            conn.query('SELECT * FROM evento', (err, eventos) => {
                conn.query('SELECT partido.*, resultado.idevento AS resevento, resultado.idpartido AS respartido, resultado.equipo1 AS resequipo1, ' + 
                           'resultado.equipo2 AS resequipo2, subConsultapais.idpais AS pais1, subConsultapais.nombre AS nombre1, ' + 
                           'subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, subConsultapais2.nombre AS nombre2, ' + 
                           'subConsultapais2.archivo AS archivo2 ' +
                           'FROM partido LEFT JOIN resultado ON partido.idpartido = resultado.idpartido, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, ' + 
                           '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                           'WHERE partido.equipo1 = subConsultapais.idpais AND partido.equipo2 = subConsultapais2.idpais AND partido.evento = ? ' + 
                           'ORDER BY partido.grupo, partido.fecha', [evento], (err, partidos) => {
                    conn.query('SELECT * FROM evento WHERE idevento = ?',[evento], (err, eventoSel) => {
                        process.env.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                                            
                        res.render('resultado.ejs', {
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