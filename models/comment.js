//Definición del modelo de comment con validación

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		'Comment',
		{texto:{
			type: DataTypes.STRING,
			validate: { notEmpty: {msg:"--> Comentario vacío"}}
		},
		publicado: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	}
	);
}