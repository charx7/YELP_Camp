
// =====================
// Rutas de HOOME
// =====================
// Requisitos de Importacion
var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../Modelos/user");


// Definimos el routing para la HOME page
router.get("/", function(request, response){
    response.render("landing");
});


// =====================
// Rutas de Autorizacion
// =====================
// Mostrar forma de autorizacion
router.get("/registro", function(request, response){
    response.render("registrate");
});

router.post("/registro", function(request, response){
    // Van los metodos de resgistro de PASSPORT
    // Recibe los datos de la form
    var newUser = new User({username: request.body.username});
    User.register(newUser, request.body.password, function(error, user){
        if(error){
            console.log(error);
            // En caso de error te redirige a la pagina de registro nuevamente
            response.render("registrate");
        } else {
            console.log("Registro al usuario");
            // Hacemos que el paquete de passport se encargue de la autenticacion
            passport.authenticate("local")(request, response, function(){
                console.log("Entro a autenticar");
                response.redirect("/sitiosparaacampar/");
            });
        }
    });
});

// Mostrar forma de login
router.get("/login", function(request,response){
    response.render("login");
});

// Metodos de POST de login se encarga de manejar el login
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/sitiosparaacampar",
        failureRedirect: "/login"
    }), function(request, response){
});

// Ruteo de Logout
router.get("/logout", function(request, response){
    request.logout();
    response.redirect("/sitiosparaacampar");
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