//Declaramos el objeto que exportaremos como respuesta
const controller = {};




//MÉTODOS
//Visualizamos en un select para que el usuario seleccione el evento de los resultados a visualizar 
controller.selEventoOficial = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            process.env.EVENTO_SEL_NOMBRE = "";

            res.render('resultadosOficiales.ejs', {
                eventos: eventos,
            });
        });
    })
}


//Mostramos los partidos seleccionados según el evento para su captura
controller.verResultadosOficiales = (req, res) => {
    const idevento = req.body.evento;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            conn.query('SELECT resultado.idevento AS resulEvento, resultado.idpartido AS resulIdpartido, resultado.equipo1 AS resulEquipo1, ' +
                       'resultado.equipo2 AS resulEquipo2, partido.*, subConsultapais.idpais AS pais1, subConsultapais.nombre AS nombre1, ' +
                       'subConsultapais.archivo AS archivo1, subConsultapais2.idpais AS pais2, subConsultapais2.nombre AS nombre2, ' +
                       'subConsultapais2.archivo AS archivo2 ' +
                       'FROM resultado, partido, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, ' +
                       '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2 ' +
                       'WHERE resultado.idpartido = partido.idpartido AND partido.equipo1 = subConsultapais.idpais AND ' +
                       'partido.equipo2 = subConsultapais2.idpais AND partido.evento = ?', [idevento], (err, partidos) => {
                conn.query('SELECT * FROM evento WHERE idevento = ?',[idevento], (err, eventoSel) => {
                    process.env.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                                        
                    res.render('resultadosOficiales.ejs', {
                        eventos: eventos,
                        data: partidos
                    });
                });    
            }); 
        });
    })
}




//Exportamos el objeto
module.exports = controller;