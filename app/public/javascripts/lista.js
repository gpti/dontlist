$(function() {
	$(".check-item").on("change", function() {
		$(this).siblings("label").toggleClass("done");

		$.ajax("/concluir-item", {//ronaldo
			type: 'GET',
			data:{
				id: $(this).attr('data-id'),
				concluido: this.checked
			},
			complete: function(xhr){
				console.log(xhr);
			}
		});
	});
});