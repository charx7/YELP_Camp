// Importacion de mongoose
var mongoose = require("mongoose");
// Inicializacion del esquema de la BDD
var comentariosSchema = mongoose.Schema({
    texto: String,
    autor: String
});

module.exports = mongoose.model("comentario",comentariosSchema);
