// Requerimientos e importaciones del servidor
var express = require("express");
var app = express();
// Importaciones del body parser para parsear los posts methods y le decimos a express que la use
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Aniadimos la importacion de Mongoose
var mongoose = require("mongoose");
// Conectando a la BDD desde localhost (necesita estar el demonio corriendo y creando la BDD 
mongoose.connect("mongodb://localhost/yelp_camp");

// Importando los requerimientos de esquemas de la BDD
var campamentos = require("./Modelos/esquemaCampamentos");

// Importando el modulo de semillas para crear campamentos artificiales
var semillaBD = require("./seeds");

// Requerir el modulo del esquema de comentarios
var comentario = require("./Modelos/esquemaComentarios");

// Importando modulos de autenticacion
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./Modelos/user");

// Semillear la BDD
semillaBD();

// Creando un campamento
// campamentos.create(
//     {
//         nombreCampamento: "LolXDMafiaCampamento",
//         imagenCampamento: "https://assets.vice.com/content-images/contentimage/no-slug/d8582d38918fa398a67e269684fefb67.jpg",
//         descripcionCampamento: "Un lindo campamento en donde vemos a muchos lory monys diciendo lolxdmafia"
//     }, function(error, resultado){
//     if(error) {
//         console.log("Aiudaa Error");
//         console.log(error);
//     } else {
//         console.log("Nuevo Campamento Creado");
//         console.log(resultado);
//     }
// });



// Definimos temporalmente uno arreglo con sitios para acampar en formato objeto de javacript
// var campamentos = [
//     {
//         nombreCampamento: "Guslanding",
//         imagenCampamento: "http://cdn.traveler.es/uploads/images/thumbs/es/trav/2/s/2016/02/deja_que_te_invada_el_espiritu_de_los_60_12_ideas_para_unas_vacaciones_hippies_183389546_1200x800.jpg"
//     },
//     {
//         nombreCampamento: "LolXDMafiaCampamento",
//         imagenCampamento: "https://assets.vice.com/content-images/contentimage/no-slug/d8582d38918fa398a67e269684fefb67.jpg"
//     },
//     {
//         nombreCampamento: "OtroLindoSitio",
//         imagenCampamento: "https://static1.squarespace.com/static/55ecd96fe4b0cee523072594/t/5734037a4c2f8582b5859ecd/1463026556921/FlashCamp_HR0075.jpg?format=1500w"
//     },
//     {
//         nombreCampamento: "Guslanding",
//         imagenCampamento: "http://cdn.traveler.es/uploads/images/thumbs/es/trav/2/s/2016/02/deja_que_te_invada_el_espiritu_de_los_60_12_ideas_para_unas_vacaciones_hippies_183389546_1200x800.jpg"
//     },
//     {
//         nombreCampamento: "LolXDMafiaCampamento",
//         imagenCampamento: "https://assets.vice.com/content-images/contentimage/no-slug/d8582d38918fa398a67e269684fefb67.jpg"
//     },
//     {
//         nombreCampamento: "OtroLindoSitio",
//         imagenCampamento: "https://static1.squarespace.com/static/55ecd96fe4b0cee523072594/t/5734037a4c2f8582b5859ecd/1463026556921/FlashCamp_HR0075.jpg?format=1500w"
//     }
// ];

// Para definir el timpo de template a usar
app.set("view engine", "ejs");

// Definimos los Css que se van a usar
app.use(express.static(__dirname + "/public"));

// Configuracion de PASSPORT
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Definimos el routing para la HOME page
app.get("/", function(request, response){
    response.render("landing");
});

app.get("/sitiosparaacampar", function(request, response){
    // Pasa el objeto de arreglo de campamentos
    //response.render("sitiosparaacampar", {campamentos: campamentos});

    // Sacar todos los campamentos de la BDD
    campamentos.find({}, function(error, resultado) {
        if(error){
            console.log("Aiuda error");
            console.log(error);
        } else {
            response.render("campamentos/sitiosparaacampar", {campamentos: resultado});
        }
    });
});

// Ruteo para el metodo POST de aniadir sitios para acampar
app.post("/sitiosparaacampar", function(request, response){
    // Sacar los datos de la forma y aniadirla al arreglo de campamentos
    var nuevoNombre = request.body.nombreNuevoCampamento;
    var nuevaImagen = request.body.nombreNuevaImagen;
    var nuevaDescripcion = request.body.nombreNuevaDescripcion;
    var nuevoSitio = {
            nombreCampamento: nuevoNombre,
            imagenCampamento: nuevaImagen,
            descripcionCampamento: nuevaDescripcion 
    };
    // Crear un nuevo campamento en la BDD de Mongo
    campamentos.create(nuevoSitio, function(error,respuesta) {
        if(error){
            console.log("Error Creando el campamento");
        } else {
            // Redirigir a la pagina de sitiosparaacampar con metodo GET
            response.redirect("/sitiosparaacampar");
        }
    });
    //campamentos.push(nuevoSitio);
});

// Ruta para crear un nuevo campamento
app.get("/sitiosparaacampar/nuevo", function(request, response){
    response.render("campamentos/nuevoCampamento");
});

// SHOW - Route
// Ruta para acceder a un elemento especifico de la pagina web tiene que ir despues de la ruta de nuevo
app.get("/sitiosparaacampar/:id", function(request, response){
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

// ============================
// Rutas de Comentarios
// ============================
app.get("/sitiosparaacampar/:id/comentarios/nuevo", isLoggedIn, function(request, response){
    // Encontrar campamentos por ID
    campamentos.findById(request.params.id, function(error, respuesta){
        if(error){
            console.log(error);
        } else {
            response.render("comentarios/nuevoComentario", {campamento: respuesta});
        }
    });
});

app.post("/sitiosparaacampar/:id/comentarios", function(request, response){
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

// =====================
// Rutas de Autorizacion
// =====================
// Mostrar forma de autorizacion
app.get("/registro", function(request, response){
    response.render("registrate");
});

app.post("/registro", function(request, response){
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
app.get("/login", function(request,response){
    response.render("login");
});

// Metodos de POST de login se encarga de manejar el login
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/sitiosparaacampar",
        failureRedirect: "/login"
    }), function(request, response){
});

// Ruteo de Logout
app.get("/logout", function(request, response){
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

// Listener para establecer puerto
app.listen(3000, function(){
    console.log("Servidor Corriendo");
});