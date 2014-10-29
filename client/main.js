function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getResourcesList(text){
	url = "http://spotlight.dbpedia.org:80/rest/annotate?text="+ encodeURIComponent(text);
	console.log(url);
	var res = httpGet(url);
	var el = document.createElement( 'div' );
	el.innerHTML = res;
	var resourceList = "(";
	var resources = el.getElementsByTagName( 'a' ); // Live NodeList of your anchor elements
	var s = "";
	//console.log(res);
	for(var i=0; i<resources.length;i++){
		var a = resources[i];
		console.log(a.attributes.href.value);
		s = a.attributes.href.value;
		resourceList+="<";
		resourceList = resourceList.concat(s);
		resourceList+=">";
		if(i < resources.length-1){
			resourceList+=", ";
		}
	}
	resourceList += ")";
	return resourceList;
}


function generateSPARQLRequest(text){
	var uriList = getResourcesList(text);
	var sparqlRequest = "SELECT ?s ?p ?o WHERE { ?s ?p ?o. FILTER(?s in "+uriList+" && ?p not in (owl:sameAs) ).}";
	
	return sparqlRequest;
}

(function(console){

console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)

function parseJSON2RDF(jsonObj){
	var bindings = jsonObj.results.bindings;
	
	var sList = [];
	
	for(var i=0; i<bindings.length;i++){
		var o = bindings[i].o;
		var s = bindings[i].s;
		
		s.size = 10;
		o.size = 10;
		var oc = false;
		for(var j=0; j<sList.length;j++){
			if(sList[j].value === o.value){
				oc = true;
				break;
			}
		}
		if(!oc){
			sList.push(o);
			if(o.type === 'uri'){
				o.name = o.value;
			}
			else{
				o.name = "s"+sList.length;
			}
			s.size = 10;
		}
		
		var sc = false;
		for(var j=0; j<sList.length;j++){
			if(sList[j].value === s.value){
				sc = true;
				break;
			}
		}
		if(!sc){
			sList.push(s);
			if(s.type === 'uri'){
				s.name = s.value;
			}
			else{
				s.name = "s"+sList.length;
			}
			s.size = 10;
		}
	}

	
	for(var i=0; i<bindings.length;i++){

		var o = bindings[i].o;
		var s = bindings[i].s;
		
		for(var j=0; j<sList.length; j++){
			if(sList[j].value === s.value){
				s = sList[j];
				break;
			}
		}
		for(var j=0; j<sList.length; j++){
			if(sList[j].value === o.value){
				o = sList[j];
				break;
			}
		}
		
		if(!s.imports){
			s.imports = [];
		}
		s.imports.push(o.name);
	}
	console.save(sList,'ok.json');
	return sList;
}

function execSPARQL(request){
	var url = "http://dbpedia.org/sparql";
	var argAfter = "&format=application%2Fsparql-results%2Bjson&timeout=30000&debug=on";
	var argBefore = "?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=";
	var finalUrl = url + argBefore + encodeURIComponent(request).replace(/%20/g, '+') + argAfter;
	console.log(finalUrl);
	return finalUrl;
}

function askForQueryResult(hash){
	
	var jsonTriples = JSON.parse(httpGet("/blarql/"+hash));
	console.log(jsonTriples.errId);
	if(jsonTriples.errId){
		console.log("Result not ready");
		setTimeout(function(){
			askForQueryResult(hash);
		},1000);
	}
	else{
		console.log(jsonTriples);
	}
}

$(document).ready(function($) {
	$('#go').click(function(evt) {
		var text = $('#text').val();
		var query = generateSPARQLRequest(text);
		console.log(query);
		var postBody = {
			query : query
		};	
		//$.post('/blarql', {"query": JSON.stringify(query)}, function(data, textStatus, xhr) {
		//	console.log(data);
		//}, 'json');

		$.ajax({
			url: '/blarql',
			dataType: 'json',
			type: 'post',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(postBody),
			success: function( data, textStatus, jQxhr ){ 
				console.log(data); 
				askForQueryResult(data.hash);
			}, 
			error: function( jqXhr, textStatus, errorThrown ){
				console.log( errorThrown );
			}
		});
		
	});	
});
