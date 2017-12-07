// Importamos Mongoose
var mongoose = require("mongoose");

// Importamos los esquemas
var campamentos = require("./Modelos/esquemaCampamentos");
var comentario = require("./Modelos/esquemaComentarios");

// Definimos los datos dummy a rellenar
var data = [
    {nombreCampamento: "Gustavos landing", 
    imagenCampamento: "https://assets.vice.com/content-images/contentimage/no-slug/d8582d38918fa398a67e269684fefb67.jpg",
    descripcionCampamento: "Un lindo Gustavo lopez en la naturaleza rodeado de arbolitos XD"},

    {nombreCampamento: "LolXDMafiaCampamento",
    imagenCampamento: "http://campamentostriton.com/wp-content/uploads/2015/11/CTIC.jpg",
    descripcionCampamento: "Un campamento rodeado de la naturaleza natural de naturando naturalmente"},

    {nombreCampamento: "SamLandia",
    imagenCampamento: "https://d8y2rwmu65naz.cloudfront.net/1495545664-CAMPAMENTOS-EUROBRIDGE.jpg",
    descripcionCampamento: "Un campamento rodeado kaozbender en la naturaleza natural"}
];

// Borrar todo lo pre-existente en la BD y lo rellena
function semillaBD () {
    // Funcion para remover los datos
    campamentos.remove({}, function(error){
        if(error){
            console.log(error);
        } else {
            console.log("Campamentos Eliminados");

            // Funcion para aniadir datos a la BDD
            data.forEach(function (elemento){
                campamentos.create(elemento, function(error, campamentoAniadido){
                    if(error){
                        console.log(error);
                    } else {
                        console.log("Campamento aniadido");
                        // Crear comentarios dummy en cada campamento
                        comentario.create(
                            {
                                texto: "Este lugar es maravilloso por fin estoy rodeado de guslopez",
                                autor: "GUSTRAGO"
                            }, function (error, comment){
                            if(error){
                                console.log(error);
                            } else {
                                campamentoAniadido.comentarios.push(comment);
                                campamentoAniadido.save();
                                console.log("Creado comentario nuevo");
                            }
                        });
                    }
                });
            });
        }
    });
}

// Linea para definir la exportacion de la funcion
module.exports = semillaBD;
