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
// Instalacion del Schema de la BDD
var esquemaCampamento = new mongoose.Schema({
    nombreCampamento: String,
    imagenCampamento: String
});
// Compilando el modelo
var campamentos = mongoose.model("Campamento", esquemaCampamento);
// Creando un campamento
// campamentos.create(
//     {
//         nombreCampamento: "LolXDMafiaCampamento",
//         imagenCampamento: "https://assets.vice.com/content-images/contentimage/no-slug/d8582d38918fa398a67e269684fefb67.jpg"
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

// para definir el timpo de template a usar
app.set("view engine", "ejs");

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
            response.render("sitiosparaacampar", {campamentos: resultado});
        }
    });
});

// Ruteo para el metodo POST de aniadir sitios para acampar
app.post("/sitiosparaacampar", function(request, response){
    // Sacar los datos de la forma y aniadirla al arreglo de campamentos
    var nuevoNombre = request.body.nombreNuevoCampamento;
    var nuevaImagen = request.body.nombreNuevaImagen;
    var nuevoSitio = {
            nombreCampamento: nuevoNombre,
            imagenCampamento: nuevaImagen 
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
    response.render("nuevoCampamento");
});

// Listener para establecer puerto
app.listen(3000, function(){
    console.log("Servidor Corriendo");
});