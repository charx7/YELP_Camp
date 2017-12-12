// ===========================
// Rutas de Campamentos
// ===========================
// Requerimientos de los esquemas etc
var express = require("express");
var router = express.Router();
var campamentos = require("../Modelos/esquemaCampamentos");
var comentario  = require("../Modelos/esquemaComentarios");



router.get("/sitiosparaacampar", function(request, response){
    // Pasa el objeto de arreglo de campamentos
    //response.render("sitiosparaacampar", {campamentos: campamentos});

    // Sacar todos los campamentos de la BDD
    campamentos.find({}, function(error, resultado) {
        if(error){
            console.log("Aiuda error");
            console.log(error);
        } else {
            response.render("campamentos/sitiosparaacampar", {campamentos: resultado, currentUser: request.user});
        }
    });
});

// Ruteo para el metodo POST de aniadir sitios para acampar
router.post("/sitiosparaacampar", isLoggedIn, function(request, response){
    // Sacar los datos de la forma y aniadirla al arreglo de campamentos
    var nuevoNombre = request.body.nombreNuevoCampamento;
    var nuevaImagen = request.body.nombreNuevaImagen;
    var nuevaDescripcion = request.body.nombreNuevaDescripcion;
    var nuevoAutor = {
        id: request.user._id,
        username: request.user.username
    };
    var nuevoSitio = {
            nombreCampamento: nuevoNombre,
            imagenCampamento: nuevaImagen,
            descripcionCampamento: nuevaDescripcion,
            autor: nuevoAutor 
    };
    console.log(request.user);
    // Crear un nuevo campamento en la BDD de Mongo
    campamentos.create(nuevoSitio, function(error,respuesta) {
        if(error){
            console.log("Error Creando el campamento");
        } else {
            // Redirigir a la pagina de sitiosparaacampar con metodo GET
            console.log(respuesta);
            response.redirect("/sitiosparaacampar");
        }
    });
    //campamentos.push(nuevoSitio);
});

// Ruta para crear un nuevo campamento
router.get("/sitiosparaacampar/nuevo", isLoggedIn, function(request, response){
    response.render("campamentos/nuevoCampamento");
});

// SHOW - Route
// Ruta para acceder a un elemento especifico de la pagina web tiene que ir despues de la ruta de nuevo
router.get("/sitiosparaacampar/:id", function(request, response){
    // Encontrar el sitio para acampar con el id provisto
    var idActual = request.params.id;
    campamentos.findById(idActual).populate("comentarios").exec(function(error, respuesta){
        if(error){
            console.log(error);
        } else {
            console.log(respuesta);
            // Mostrar el template con el sitio especifico
            response.render("campamentos/mostrar", {campamentoEncontrado: respuesta});
        }
    });
    
    
});

// Ruta para EDITAR un campamento
router.get("/sitiosparaacampar/:id/editar", function(request, response){

    // Esta el usuario autenticado?
    if(request.isAuthenticated()){


        campamentos.findById(request.params.id, function(error, respuestaAlQuery){
            if(error){
                console.log(error);
                res.redirect("/sitiosparaacampar");
            } else {
                // Verifica si el usuario es dueño del campamento para permitirle editar
                if(respuestaAlQuery.autor.id.equals(request.user._id)){
                    console.log("Entro a editar")
                    response.render("campamentos/editar",{campamento: respuestaAlQuery});
                } else {
                    response.send("No tienes Permiso XD");
                }
            }
        });
    }   else {
        response.send("Necesitas Logearte");
    }
});

// UPDATE la ruta de campamento
router.put("/sitiosparaacampar/:id", function(request, response) {
    // Encontrar y hacer update a las caractaristicas del campamento correcto
    console.log("el id a editar es: " + request.params.id);
    campamentos.findByIdAndUpdate(request.params.id, request.body.editar, function(error, respuesta){
        if(error){
            console.log(error);
            response.redirect("/sitiosparaacampar");
        }   else {
            console.log("entro a editar");
            response.redirect("/sitiosparaacampar/" + request.params.id);
        }
    });
    // Redirigir a la pagina de mostrar el campamento editado 
});

// Ruteo para ELIMINAR algun campamento
router.delete("/sitiosparaacampar/:id", function(request, response){
    // Instruccion de mongoose para eliminar un campamento
     campamentos.findByIdAndRemove(request.params.id, function(error){
        if(error){
            response.redirect("/sitiosparaacampar");
        } else {
            response.redirect("/sitiosparaacampar");
        }
     });
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