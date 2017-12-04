// Requerimientos e importaciones del servidor
var express = require("express");
var app = express();
// Importaciones del body parser para parsear los posts methods y le decimos a express que la use
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Definimos temporalmente uno arreglo con sitios para acampar en formato objeto de javacript
var campamentos = [
    {
        nombreCampamento: "Guslanding",
        imagenCampamento: "http://cdn.traveler.es/uploads/images/thumbs/es/trav/2/s/2016/02/deja_que_te_invada_el_espiritu_de_los_60_12_ideas_para_unas_vacaciones_hippies_183389546_1200x800.jpg"
    },
    {
        nombreCampamento: "LolXDMafiaCampamento",
        imagenCampamento: "https://assets.vice.com/content-images/contentimage/no-slug/d8582d38918fa398a67e269684fefb67.jpg"
    }
];

// para definir el timpo de template a usar
app.set("view engine", "ejs");

// Definimos el routing para la HOME page
app.get("/", function(request, response){
    response.render("landing");
});

app.get("/sitiosparaacampar", function(request, response){
    // Pasa el objeto de arreglo de campamentos
    response.render("sitiosparaacampar", {campamentos: campamentos});
});


// Listener para establecer puerto
app.listen(3000, function(){
    console.log("Servidor Corriendo");
});