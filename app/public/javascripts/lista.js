$(function() {

	$(".lista").on("click", ".delete", function() {
		var id = $(this).siblings("input").data('id');
		var that = $(this);
		$.ajax("/deletar-item", {
			type: 'POST',
			data: { id : id},
			complete: function(xhr) {
				that.parent().remove();
			}
		})
	});

	$(".lista").on("change", ".check-item", function() {
		$(this).siblings("label").toggleClass("done");

		$.ajax("/concluir-item", {
			type: 'POST',
			data:{
				id: $(this).attr('data-id'),
				concluido: this.checked
			},
			complete: function(xhr){
				console.log(xhr);
			}
		});
	});
	$('ul').on('mouseenter mouseleave', '.item', function(){
		$(this).find('a').fadeToggle();
	});

	$("#newItemForm").on("submit", function(e) {
		var descricao = $("#newItem").val();

		e.preventDefault();
		$.ajax(document.location.href+"/novo-item", {
			type: "POST",
			data: {
				descricao: descricao
			},
			complete: function(xhr){
				if(xhr.status != 200) {
					alert("Deu ruim");
					return;
				}

				var a =	$("#newItem");
				var id = xhr.responseText; //dado aleatorio de 100 faces
				a.parent().parent().before(
					"<li class='item'>" +
					"<input type='checkbox' id='item" + id +
						"' data-id='" + id +
					"' class='check-item'>" +
					"<label for='item" + id + "'>" + a.val() + "</label>" +
					"<a href='javascript:void(0)' title='remover item' style='padding-left: 5px;display:none' class='delete'>x</a>"+
					"</li>"
				);
				a.val("");
			}
		});
	});
});