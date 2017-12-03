// Requerimientos e importaciones del servidor
var express = require("express");
var app = express();
// Importaciones del body parser para parsear los posts methods y le decimos a express que la use
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// para definir el timpo de template a usar
app.set("view engine", "ejs");



// Listener para establecer puerto
app.listen(3000, function(){
    console.log("Servidor Corriendo")
});