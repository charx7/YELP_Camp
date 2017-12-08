// Requerimientos de la BDD
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// Definimos el esquema a utilizar para guardar a nuestros usuarios y los PW hasheados en la BDD
var UserSchema = new mongoose.Schema({
    usernme: String,
    password: String
});

// Aniadimos los metodos de seguridad de passport
UserSchema.plugin(passportLocalMongoose);
// Exportamos
module.exports = mongoose.model("User", UserSchema);