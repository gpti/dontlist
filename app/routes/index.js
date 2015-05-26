var express = require('express');
var router = express.Router();
var db = express.db;

/* GET home page. */
router.route('/').get(function(req, res, next) {
	res.render('index', { title: 'DontList' });
});

router.route('/concluir-item').post(function(req, res){

	db.query("UPDATE itens SET concluido = " + req.body.concluido + " WHERE id = " + req.body.id,
		function(err,rows,fields) {
		}
	);

});

router.route('/:lista').get(function(req, res) {
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


router.route('/:lista/novo-item').post(function(req, res){
	var lista = req.params.lista;

	db.query("SELECT id FROM listas WHERE nome = '" + lista +"'" ,
		function(err,rows,fields) {
			var id = rows[0].id;
			var descricao = req.body.descricao;

			db.query('INSERT INTO itens (descricao, lista_id) VALUES ("'+descricao+'", '+id+')',
				function(err,rows,fields){
					res.send(200, rows.insertId);
				});
		});
});

router.route("/deletar-item").post(function(req, res){
	var id = req.body.id;
	db.query("DELETE FROM itens WHERE id = ?", id, function(err, rows, fields){
		if(!err) res.send(200);
	});
});

module.exports = router;
