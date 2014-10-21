$(function () {
	var url = "http://www.le-titan.com";
	console.log(url);

	$.get(url, function(data) {
		$('#test').html(data);
	});
});