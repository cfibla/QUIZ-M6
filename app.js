var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use (methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

//Helpers dinámicos:
app.use(function(req,res,next){

    //guardar path en session.redir para que después
    //de login o logout vuelva a la misma página
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir=req.path;
    }

    //Hacer visible req.session en las vistas
    res.locals.session=req.session;
    next();
});

//Tiempo de sesión
app.use(function(req,res,next){
    var tiempoSesion = req.session.timer;
    if(tiempoSesion){
    var hora = new Date().getTime();
    var tiempoLimite = 12000;
    
    if (hora - tiempoSesion >= tiempoLimite){
        delete tiempoSesion;
        res.redirect("/logout");
    } else {
        tiempoSesion = hora;
    }}
    next();
});

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors:[]
    });
});


module.exports = app;
