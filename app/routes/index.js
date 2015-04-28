var express = require('express');
var router = express.Router();
var db = express.db;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'DontList' });
});

router.get('/concluir-item', function(req, res){

	db.query("UPDATE itens SET concluido = " + req.query.concluido + " WHERE id = " + req.query.id,
		function(err,rows,fields) {
		}
	);

});

router.get('/:lista', function(req, res) {
	var lista = req.params.lista;

	db.query("SELECT id FROM listas WHERE nome = '" + lista +"'" ,
	function(err,rows,fields) {

		if(err) throw err;
		if(rows.length == 0) {
			res.render('error',{
				message : "nada nesta lista"
			});
			//um dia aqui vai fazer algo
		} else {

			var data = {};
			data.lista = req.params.lista;
			data.title = req.params.lista + ' | DontList';
			data.itens = [];

			db.query("SELECT id, descricao, concluido FROM itens WHERE lista_id = "+rows[0].id, function(err,rows,fields){
				if(err) throw err;
				data.itens = rows;

				res.render('lista', data);
			});
		}
	});
});

module.exports = router;
