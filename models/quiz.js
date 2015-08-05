// Definición del modelo de Quiz

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz',
	{
		tema: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg:"ERROR: Falta el tema"}}
		},
		pregunta: { 
			type: DataTypes.STRING,
			validate: { notEmpty: {msg:"ERROR: Falta la pregunta"}}
		},
		respuesta: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg:"ERROR: Falta la respuesta"}}
		}
	});
}