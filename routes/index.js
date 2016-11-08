var express = require('express'), router = express.Router();
router.get('/', function(req, res){
  res.render('app.html');
});
router.get('/list', function(req, res){
  res.render('app.html');
});
router.get('/list_contents', function(req, res){
  res.render('app.html');
});
router.get('/inicio', function(req, res){
  res.render('app.html');
});
router.get('/confirmacao', function(req, res){
  res.render('app.html');
});
router.use('/api/participants', require('./participants'));
module.exports = router;
