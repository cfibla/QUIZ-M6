var models=require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find({

		where:{	id:Number(quizId)},
		include:[{model:models.Comment}]

		}).then(
		function(quiz){
			if (quiz){
				req.quiz = quiz;
				next();
			}
			else { next (new Error('No existe quizId=' + quizId));}
		}
		).catch(function(error){next(error);});
};

//GET /quizes
exports.index = function (req, res){


		
	
	if(req.query.search){
		var filtro=(req.query.search||'').replace(" ","%");
		models.Quiz.findAll({where:['pregunta like ?','%'+filtro+'%'],order:'pregunta ASC'})
		.then(
			function(quizes){
			/*	if(!models.Quiz)
					{res.render('quizes/vacio');
				} else*/
				res.render('quizes/index', {quizes: quizes, errors:[]});
			}
		).catch(function(error){next(error);});


	} else 

	if(req.query.tema){
		var filtro=(req.query.tema || '');
		models.Quiz.findAll({where:['tema like ?','%'+filtro+'%'],order:'tema ASC'})
		.then(
			function(quizes){
				res.render('quizes/index', {quizes: quizes, errors:[]});
			}
		).catch(function(error){next(error);});

	} else {

	models.Quiz.findAll().then(
		function(quizes){
			res.render('quizes/index', {quizes: quizes, errors:[]});
		}
	).catch(function(error){next(error);});
	}
};

//GET /quizes/:id
exports.show = function (req, res){
	
	res.render('quizes/show', {quiz: req.quiz,  errors:[]});
};

//GET /quizes/:id/edit
exports.edit = function (req, res){
	var quiz = req.quiz; //autoload instancia de quiz
	res.render('quizes/edit', {quiz: quiz, errors:[]});
};

//GET /quizes/answer
exports.answer = function (req, res) {
	var resultado ='Incorrecto'
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
		res.render('quizes/answer',
			{quiz: req.quiz,
			respuesta: resultado,
			errors:[]});
};

//GET /quizes/new: CUANDO SE AÑADEN NUEVAS PREGUNTAS
exports.new = function (req, res){
	var quiz = models.Quiz.build(//crea objeto quiz
		{tema:'Tema', pregunta: 'Pregunta', respuesta:'Respuesta'}
		);
		res.render('quizes/new', {quiz: quiz, errors:[]});
};

//POST /quizes/create: CUANDO SE CREA UNA NUEVA PREGUNTA Y RESPUESTA EN LA DB Y SE ENVIA
exports.create = function (req, res) {
	var quiz = models.Quiz.build (req.body.quiz);
	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				//guarda en la DB los campos pregunta y respuesta de quiz
				quiz
				.save({fields: ["tema", "pregunta", "respuesta"]})
				.then(function(){ res.redirect('/quizes')})
				//res.redirect: redirección HTTP (URL relativo) lista de preguntas
			}
		}
	);
};
//PUT /quizes/:id
exports.update = function (req, res) {
	req.quiz.tema = req.body.quiz.tema;
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				//guarda en la DB los campos pregunta y respuesta de quiz
				req.quiz
				.save({fields: ["tema", "pregunta", "respuesta"]})
				.then(function(){ res.redirect('/quizes')})
				//redirección HTTP (URL relativo) lista de preguntas
			}
		}
	);
};
//DELETE/quizes/:id
exports.destroy = function (req, res){
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function (error){next(error);});
};