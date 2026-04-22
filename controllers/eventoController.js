//Declaramos el objeto que exportaremos como respuesta
const controller = {};



//MÉTODOS
//Visualiza la pantalla de alta evento
controller.visualizar_evento = (req, res) => {
    res.render('alta_evento.ejs');
}


//Da de alta un nuevo evento
controller.alta_Nuevo_Evento = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('INSERT INTO evento SET ?', [data], (err, evento) => {
            res.render('alta_evento.ejs', {
                alta: "Se ha dada de ALTA correctamente el evento: " + req.body.nombre + "."
            });
        });
    });
}


//Mostrar los eventos para posteriormente eliminarlos
controller.mostrar_evento = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM evento', (err, eventos) => {
            res.render('eliminar_evento.ejs', {
                data: eventos
            });
        });
    });
};


//Eliminar un evento
controller.eliminar_evento = (req, res) => {
    const id = req.params.idevento;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM evento WHERE idevento = ?', [id], (err, evento) => {
            conn.query('SELECT * FROM evento', (err, eventos) => {
                res.render('eliminar_evento.ejs', {
                    data: eventos,
                    borrado: 'Se ha ELIMINADO el evento seleccionado.'
                });
            });    
        });
    })
}




//Exportamos el objeto
module.exports = controller;