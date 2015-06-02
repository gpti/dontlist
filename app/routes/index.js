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

router.route('/*').get(function(req, res) {
	var lista = req.params[0].replace(/\/+$/,'');

	db.query("SELECT id FROM listas WHERE nome = '" + lista +"'" , function(err,rows,fields) {
		if(err) throw err;

		var listExists = rows.length != 0;
		var listId = rows.length ? rows[0].id : 0;

		var data = {};
		data.lista = lista;
		data.title = lista + ' | DontList';
		data.itens = [];

		db.query("SELECT * FROM listas WHERE nome LIKE '" + lista +"/%'" , function(err,rows,fields) {
			data.childrenLists = rows;

			if(listExists) {
				db.query("SELECT id, descricao, concluido FROM itens WHERE lista_id = "+listId, function(err,rows,fields){
					if(err) throw err;
					data.itens = rows;

					res.render('lista', data);
				});
			} else {
				res.render('lista', data);
			}
		});
	});
});


router.route('/*/novo-item').post(function(req, res){
	var lista = req.params[0].replace(/\/+$/,'');

	function InsertItem(listId, description){
		db.query('INSERT INTO itens (descricao, lista_id) VALUES ("'+description+'", '+listId+')',
			function(err,rows,fields){
				res.send(200, rows.insertId);
			});
	}

	db.query("SELECT id FROM listas WHERE nome = '" + lista +"'" ,
		function(err,rows,fields) {
			var descricao = req.body.descricao;
			if(rows.length == 0) {
				db.query("INSERT INTO listas (nome) VALUES ('"+lista+"')", function(err, rows, fields){
					InsertItem(rows.insertId, descricao)
				});
			}else{
				InsertItem(rows[0].id, descricao)
			}
		});
});

router.route("/deletar-item").post(function(req, res){
	var id = req.body.id;

	function deletaItem(id, callback){
		db.query("DELETE FROM itens WHERE id = ?", id, function(err, rows, fields){
			callback();
		});
	}

	db.query("SELECT COUNT(*) as num_itens, lista_id FROM itens WHERE lista_id = (SELECT lista_id FROM itens WHERE id = ?)", [id], function(err, rows, fields){
		deletaItem(id, function(){
			if(rows[0].num_itens == 1) {
				db.query("DELETE FROM listas WHERE id = ?", [rows[0].lista_id], function (err, rows, fields) {
					if (err) throw err;
					res.send(200);
				})
			} else {
				res.send(200);
			}
		});
	});

});

module.exports = router;
