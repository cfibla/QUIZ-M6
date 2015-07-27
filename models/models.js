var path=require('path');

//Postgres DATABASE_URL = Postgres://user:passwd@host:port/database
//Sqlite DATABASE_URL = sqlite://:@:/
var url=process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var host = (url[4]||null);
var port = (url[5]||null);
var DB_name = (url[6]||null);
var storage = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize=require('sequelize');

//Usar DB SQlite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{
		dialect: dialect,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage, 	//solo SQlite (.env)
		omitNull: true		//solo Postgres
	}
	);

//Importar la definición de la tabla Quiz en quiz.js
var Quiz=sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz=Quiz;//exportar definición de tabla Quiz

//sequelize.sync() crea e inicializa tabla de preguntas en la DB
sequelize.sync().then(function (){
	//then(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if(count === 0)//la tabla se inicializa solo si está vacia
		{
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa'
			})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});