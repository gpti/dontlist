var express = require('express');
var router = express.Router();
var db = express.connection;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'DontList' });
});

router.get('/:lista', function(req, res) {
	var lista = req.params.lista;

	db.query("Select id from listas where nome = " + lista ,
	function(err,rows,fields) {
		if(err) throw err;
		if(rows.length == 0) {
			//um dia aqui vai fazer algo
		} else {
			res.render('lista', {
				lista: req.params.lista,
				title: req.params.lista + ' | DontList'
			});	
		}
	});
});

module.exports = router;
