// Importar mongoose para manejo de la BDD desde JS
var mongoose = require("mongoose");
// Conectando a la BDD desde localhost (necesita estar el demonio corriendo y creando la BDD 
mongoose.connect("mongodb://localhost/cat_app");
// Definimos los objetos para aniadir/modificar y esquematizar (definimos un patron)
var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

// Tomamos el esquema (patron de los objetos) y lo compilamos en un modelo y lo guardamos en una variable
// para poder usar todos los metodos de mongo (creo que es crea la coleccion en la BDD)
var Cat = mongoose.model("Cat", catSchema);

// Aniadir un gato a la BDD
// Creamos un objeto de gato usando el esquema definido
// var item = new Cat({
//     name: "Seniora Norris",
//     age: 7,
//     temperament: "Evil"
// });

// // Hacemos el comit a la BDD
// item.save(function(error, cat) {
//     if(error){
//         console.log("Algo mal :(")
//     } else {
//         console.log("Acabamos de salvar un gatito XD a la BDD");
//         console.log(cat);
//     }
// });

// Otra forma de crear un objeto a la BDD
Cat.create({
    name: "Snow white",
    age: 15,
    temperament: "Nice"
}, function(error, resultado){
    if(error){
        console.log(error);
    } else {
        console.log(resultado);
    }
});


// Hacer un query de todos los gatos de la BDD a la consola (de cada uno)
Cat.find({}, function(error, resultado) {
    if(error){
        console.log("Aiudaaa Error!!!");
        console.log(error);
    } else {
        console.log("Todos los gatos de la BDD");
        console.log(resultado);
    }
});


