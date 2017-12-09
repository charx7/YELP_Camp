// ============================
// Rutas de Comentarios
// ============================
// Requisitos de Importacion
var express = require("express");
var router = express.Router({mergeParams: true});
var campamentos = require("../Modelos/esquemaCampamentos");
var comentario  = require("../Modelos/esquemaComentarios"); 

// Crear Comentarios
router.get("/sitiosparaacampar/:id/comentarios/nuevo", isLoggedIn, function(request, response){
    // Encontrar campamentos por ID
    campamentos.findById(request.params.id, function(error, respuesta){
        if(error){
            console.log(error);
        } else {
            response.render("comentarios/nuevoComentario", {campamento: respuesta});
        }
    });
});

router.post("/sitiosparaacampar/:id/comentarios", isLoggedIn, function(request, response){
    // Ver el campamento usando el id lo saca del request que manda la forma
    campamentos.findById(request.params.id, function(error, campamentoEncontrado){
        if(error){
            console.log(error);
            campamentoEncontrado.redirect("/sitiosparaacampar");
        } else {
            comentario.create(request.body.comentario, function(error, comentarioCreado){
                if(error){
                    console.log(error);
                } else {
                    // Asociar el comentario de la forma al campamento que se le dio click
                    console.log(comentarioCreado);
                    // Aniadir username e id al comentario
                    currentUserId = request.user._id;
                    comentarioCreado.autor.id = currentUserId;
                    comentarioCreado.autor.username = request.user.username;
                    // Salvar el comentario
                    comentarioCreado.save();
                    campamentoEncontrado.comentarios.push(comentarioCreado);
                    campamentoEncontrado.save();
                    response.redirect('/sitiosparaacampar/'+ campamentoEncontrado._id);
                }
            });
        }
    });
    // Crear un nuevo comentario

    // Conectar el nuevo comentario al campamento

    // Redirigir a alguna parte
});

// Middleware que verifica si el usuario esta logeado o no
function isLoggedIn(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    response.redirect("/login");
}


// Exportamos el routador
module.exports = router;