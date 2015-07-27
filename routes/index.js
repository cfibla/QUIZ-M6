var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */

/*router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});*/

//Definición de rutas de /quizes
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);

router.get('../views/quizes',							quizController.index);
router.get('../views/quizes/:quizId(\\d+)',				quizController.show);
router.get('../views/quizes/:quizId(\\d+)/answer',		quizController.answer);

router.get('/author', function (req, res, next){
  res.render('author',{})
});

module.exports = router;
