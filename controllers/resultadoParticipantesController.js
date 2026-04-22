//Declaramos el archivo de seguridad.js que necesitamos para encriptar
const seguridad = require("../seguridad");

//Declaramos el objeto que exportaremos como respuesta
const controller = {};




//MÉTODOS
//Visualizamos en un select para que el usuario seleccione el evento de los resultados a visualizar 
controller.selEvento = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            process.env.EVENTO_SEL_NOMBRE = "";
            
            res.render('resultadoParticipantes.ejs', {
                eventos: eventos,
            });
        });
    })
}


//Mostramos los partidos seleccionados según el evento de todos los usuarios
controller.verResultados = (req, res) => {
    const idevento = req.body.evento;
    const usuario = parseInt(process.env.ID_USUARIO);
    const concurso = process.env.CLAVE_CONCURSO;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            conn.query('SELECT partido.*, quin.idevento AS quinevento, quin.idpartido AS quinpartido, ' +
                       'quin.idusuario AS quinusuario, quin.equipo1 AS quinequipo1, quin.equipo2 AS quinequipo2, ' +
                       'subConsultapais.idpais AS pais1, subConsultapais.nombre AS nombre1, subConsultapais.archivo AS archivo1, ' +
                       'subConsultapais2.idpais AS pais2, subConsultapais2.nombre AS nombre2, subConsultapais2.archivo AS archivo2, ' +
                       'subConsultausuario.nombre AS usuarionombre ' +
                       'FROM partido LEFT JOIN quin ON partido.idpartido = quin.idpartido AND quin.concurso = ?, ' +
                       '(SELECT idpais, nombre, archivo FROM pais) AS subConsultapais, (SELECT idpais, nombre, archivo FROM pais) AS subConsultapais2, ' +
                       '(SELECT idusuario, nombre FROM usuario) AS subConsultausuario ' +
                       'WHERE quin.idusuario = subConsultausuario.idusuario AND partido.equipo1 = subConsultapais.idpais AND ' +
                       'partido.equipo2 = subConsultapais2.idpais AND partido.evento = ? ' +
                       'ORDER BY quin.idusuario, partido.grupo, partido.fecha ', [concurso, idevento], (err, partidos) => {
                conn.query('SELECT * FROM evento WHERE idevento = ?',[idevento], (err, eventoSel) => {
                    process.env.EVENTO_SEL_NOMBRE = eventoSel[0].nombre;
                                        
                    for(let i = 0; i < partidos.length; i++){
                        partidos[i].usuarionombre = seguridad.desencriptado(partidos[i].usuarionombre);
                    }

                    res.render('resultadoParticipantes.ejs', {
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