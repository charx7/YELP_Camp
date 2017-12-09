// Importacion de mongoose
var mongoose = require("mongoose");
// Inicializacion del esquema de la BDD
var comentariosSchema = mongoose.Schema({
    texto: String,
    autor: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("comentario",comentariosSchema);
