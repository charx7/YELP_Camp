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

// Importando los requesitos para el ruteo
var rutasCampamentos = require("./Rutas/sitiosparaacampar"),
    rutasComentarios = require("./Rutas/comentarios"),
    rutasIndex       = require("./Rutas/index");

// Semillear la BDD
//semillaBD();

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

// Middleware que hace una variable a pasar el template segun si el usuario esta logeado o no
app.use(function(request, response, next){
    response.locals.currentUser = request.user;
    next();
});

// Definimos el uso de las rutas para que los use la APP
app.use(rutasIndex);
app.use(rutasComentarios);
app.use(rutasCampamentos);


// Listener para establecer puerto
app.listen(3000, function(){
    console.log("Servidor Corriendo");
});