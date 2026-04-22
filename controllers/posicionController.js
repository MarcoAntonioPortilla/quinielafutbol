//Declaramos el archivo de seguridad.js que necesitamos para encriptar
const seguridad = require("../seguridad");

//Declaramos el objeto que exportaremos como respuesta
const controller = {};




//MÉTODOS
//Visualizamos en un select para que el usuario seleccione el evento de los resultados a registrar 
controller.posiciones = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            process.env.EVENTO_SEL_NOMBRE = "";

            res.render('posicion.ejs', {
                eventos: eventos,
            });
        });
    })
}


//Mostramos las posiciones de los participantes según el evento seleccionado
controller.verPosiciones = (req, res) => {
    const idevento = req.body.evento;
    const concurso = process.env.CLAVE_CONCURSO;
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            conn.query('SELECT resultado.*, quin.*, usuario.idusuario, usuario.nombre, ' +
                       'SUM(if(quin.equipo1 = resultado.equipo1 AND quin.equipo2 = resultado.equipo2, 3, ' +
                       'if(quin.equipo1 = quin.equipo2 AND resultado.equipo1 = resultado.equipo2 , 1, ' +
                       'if(quin.equipo1 > quin.equipo2 AND resultado.equipo1 > resultado.equipo2 , 1, ' +
                       'if(quin.equipo1 < quin.equipo2 AND resultado.equipo1 < resultado.equipo2 , 1, 0))))) AS total ' +
                       'FROM resultado LEFT JOIN quin ON resultado.idpartido = quin.idpartido, usuario ' +
                       'WHERE resultado.idevento = ? AND usuario.idusuario = quin.idusuario AND quin.concurso = ? ' +
                       'GROUP BY usuario.idusuario ' +
                       'ORDER BY total DESC', [idevento, concurso], (err, participantes) => {
                conn.query('SELECT * FROM evento WHERE idevento = ?',[idevento], (err, eventoSel) => {
                    for(let i = 0; i < participantes.length; i++){
                        participantes[i].nombre = seguridad.desencriptado(participantes[i].nombre);
                    }
                    
                    process.env.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                                        
                    res.render('posicion.ejs', {
                        eventos: eventos,
                        data: participantes
                    });
                });    
            }); 
        });
    })
}



//Exportamos el objeto
module.exports = controller;