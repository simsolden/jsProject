//Variables

//Functions
$( document ).ready(function() {
	let $wines = $("#wines");
	$.ajax({
		type: 'GET',
		url:"js/api/wines",
		dataType: 'JSON',
		success:function(wines){
			$.each(wines, function(i, wine){
				$wines.append("<buttonid=\"buttonWine"+wine.id+"\" name=\"buttonWine"+wine.id+"+\" type=\"button\" class=\"btn btn-outline-secondary btn-block\">"+wine.name+"</button>");
			});
		},
		error:function(){
			alert("Ajax error retrieving Wine JSON");
		}
	});
});
//Main
