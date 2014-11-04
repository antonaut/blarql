// Executes a get request
function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

// Gets a string that contains every rdf resources highlighted by DBPedia in "text"
function getResourcesList(text){
	// create the URL for the GET request to spotlight
	url = "http://spotlight.dbpedia.org:80/rest/annotate?text="+ encodeURIComponent(text);
	//console.log(url);
	
	var res = httpGet(url);
	var el = document.createElement( 'div' );
	el.innerHTML = res;
	//console.log(res);

	var resources = el.getElementsByTagName( 'a' ); // Live NodeList of your anchor elements
	var s = "";
	var resourceList = "(";
	// Harvest the a tags and process the href contents into a string
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

// Generates the resources list for "text" and concats it into a SPARQL request
function generateSPARQLRequest(text){
	var uriList = getResourcesList(text);
	var sparqlRequest = "SELECT ?s ?p ?o WHERE { ?s ?p ?o. FILTER(?s in "+uriList+" && ?p not in (owl:sameAs) ).}";
	
	return sparqlRequest;
}

// Parse the result of DBPedia SPARQL into an RDF-like graph
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

// Not working : an attempt to execute a DBPedia SPARQL request as a GET request
function execSPARQL(request){
	var url = "http://dbpedia.org/sparql";
	var argAfter = "&format=application%2Fsparql-results%2Bjson&timeout=30000&debug=on";
	var argBefore = "?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=";
	var finalUrl = url + argBefore + encodeURIComponent(request).replace(/%20/g, '+') + argAfter;
	console.log(finalUrl);
	return finalUrl;
}

// Ask the nodejs server if the sparql request is processed
function askForQueryResult(hash){
	
	var jsonTriples = JSON.parse(httpGet("/blarql/"+hash));
	//console.log(jsonTriples.errId);
	if(jsonTriples.errId){
		console.log("Result not ready");
		setTimeout(function(){
			askForQueryResult(hash);
		},1000);
	}
	else{
		// LET'S CONTINUE THE PYRAMID OF DOOOOOM
		console.save(jsonTriples);
		var jGraph = parseJSON2RDF(jsonTriples);
		// Go Julien
	}
}

// A kind of a main function that follows the websem process
function websem(text){
	
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
}

// Action called when clicking the "go button"
$(document).ready(function($) {
	$('#go').click(function(evt) {
		var text = $('#text').val();
		websem(text);	
	});	
});

// Used for dev : a console hack that allows us to save an output as a file
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

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();

// Auto launch
var mainMethod = function(){
	var keywords = decodeURIComponent(QueryString.keywords);
	console.log(keywords);
	if(keywords != "undefined"){
		websem(keywords);
	}
}();
