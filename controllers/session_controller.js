//MW de autorización de accesos de usuarios con LOGIN - (Accesos  HTTP retringidos)
exports.loginRequired = function (req,res,next){
	if(req.session.user){//Si existe la propiedad user en req.session damos paso al siguiente MW (en routes/index)
		next();
	} else {
		res.redirect('/login');
	}
};


//GET /login - Formulario login
exports.new = function (req, res){
	var errors = req.session.errors || {};
	req.session.errors ={};

	res.render('sessions/new',	{errors: errors});
};

//POST /login - Crear sesión
exports.create = function (req, res){

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){

		if(error){
			req.session.errors = [{"message": 'Se ha producido un error ' + error}];
			res.redirect("/login");
			return;
		}

		//Crear req.session.user y guardar campos id y username
		//La sesión se define por la existencia de: req.session.user
		req.session.user = {
			id:user.id,
			username:user.username};

		//Crear req.session.timer para guardar la hora
		req.session.timer = new Date().getTime();
		req.session.autoLogout = false;

		res.redirect(req.session.redir.toString());//redirección a path anterior a LOGIN	
	});
};

//DELETE /logout - Destruir sesión
exports.destroy = function (req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString());//redirección a path anterior a LOGIN
};