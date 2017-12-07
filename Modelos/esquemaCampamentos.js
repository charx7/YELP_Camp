// Importando el modulo de mongoose para que se pueda hacer el esquema
var mongoose = require("mongoose");

// Instalacion del Schema de la BDD
var esquemaCampamento = new mongoose.Schema({
    nombreCampamento: String,
    imagenCampamento: String,
    descripcionCampamento: String,
    comentarios: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comentario"
        }
    ]
});
// Compilando el modelo
var campamentos = mongoose.model("Campamento", esquemaCampamento);

// Exportamos el modelo del esquema para usarlos en app.js
module.exports = campamentos;